// 모듈 임포트
import mbtiBibleMap from './data/mbtiBibleMap.js';
import { mbtiDescriptionsAdult, mbtiDescriptionsStudent } from './data/mbtiDescriptions.js';
import { swotAnalysis } from './data/swotAnalysis.js';

// 유틸리티 함수들
function calcMBTI(scores, isStudent) {
  // 점수 배열 유효성 검사
  if (!Array.isArray(scores)) {
    throw new Error('유효하지 않은 점수 데이터입니다.');
  }

  // 문항 수 및 지표별 분할
  const groupSize = isStudent ? 8 : 12;
  const totalQuestions = groupSize * 4;
  if (scores.length !== totalQuestions) {
    throw new Error(`${isStudent ? '학생용' : '성인용'} 설문조사의 모든 질문에 답변해 주세요.`);
  }

  // 각 지표별 점수 합산
  const sumEI = scores.slice(0, groupSize).reduce((a, b) => a + b, 0);
  const sumSN = scores.slice(groupSize, groupSize * 2).reduce((a, b) => a + b, 0);
  const sumTF = scores.slice(groupSize * 2, groupSize * 3).reduce((a, b) => a + b, 0);
  const sumJP = scores.slice(groupSize * 3, groupSize * 4).reduce((a, b) => a + b, 0);

  // 예/아니오(2점=예, 1점=아니오) → 0~groupSize*2점
  // 비율 계산 (예: 2점=예, 1점=아니오)
  const percent = (sum, size) => ((sum - size) / size) * 100;

  const percentEI = percent(sumEI, groupSize);
  const percentSN = percent(sumSN, groupSize);
  const percentTF = percent(sumTF, groupSize);
  const percentJP = percent(sumJP, groupSize);

  // 판정 (50% 기준, 45~55%는 중간)
  function judge(p, pos, neg) {
    if (p > 55) return pos;
    if (p < 45) return neg;
    // 중간값 구간이면, 예/아니오 개수 차이로 보정
    if (p > 50) return pos + '(중간)';
    if (p < 50) return neg + '(중간)';
    return '중간';
  }

  const mbtiType =
    judge(percentEI, 'E', 'I') +
    judge(percentSN, 'N', 'S') +
    judge(percentTF, 'F', 'T') +
    judge(percentJP, 'P', 'J');

  return mbtiType;
}

function getSWOT(type, isStudent) {
  try {
    const swotData = isStudent ? swotAnalysis.student[type] : swotAnalysis.adult[type];
    if (!swotData) {
      throw new Error(`해당 MBTI 유형(${type})의 SWOT 데이터를 찾을 수 없습니다.`);
    }
    return swotData;
  } catch (error) {
    console.error('SWOT 데이터 조회 중 오류 발생:', error);
    return {
      strengths: '데이터 없음',
      weaknesses: '데이터 없음',
      opportunities: '데이터 없음',
      threats: '데이터 없음'
    };
  }
}

function createMBTIChart(scores, isStudent) {
  try {
    const existingChart = Chart.getChart('mbtiChart');
    if (existingChart) {
      existingChart.destroy();
    }

    const labels = ['E-I', 'S-N', 'T-F', 'J-P'];
    let chartScores;
    if (isStudent) {
      // 학생용: 8문항씩 4지표
      chartScores = [
        calculateDimensionScore(scores.slice(0, 8)),
        calculateDimensionScore(scores.slice(8, 16)),
        calculateDimensionScore(scores.slice(16, 24)),
        calculateDimensionScore(scores.slice(24, 32))
      ];
    } else {
      // 성인용: 12문항씩 4지표
      chartScores = [
        calculateDimensionScore(scores.slice(0, 12)),
        calculateDimensionScore(scores.slice(12, 24)),
        calculateDimensionScore(scores.slice(24, 36)),
        calculateDimensionScore(scores.slice(36, 48))
      ];
    }

    const chartCtx = document.getElementById('mbtiChart').getContext('2d');
    new Chart(chartCtx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: isStudent ? 'MBTI 점수 합계 (최대 16점)' : 'MBTI 점수 합계 (최대 24점)',
          data: chartScores,
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'MBTI 4개 차원의 점수 합계'
          }
        },
        scales: {
          r: {
            ticks: { stepSize: 2 },
            angleLines: { display: true },
            suggestedMin: 0,
            suggestedMax: isStudent ? 16 : 24
          }
        }
      }
    });
  } catch (error) {
    console.error('차트 생성 중 오류 발생:', error);
    alert('차트 생성 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
  }
}

function calculateDimensionScore(scores) {
  return scores.reduce((acc, cur) => acc + cur, 0);
}

// PDF 생성 함수
async function generatePDF() {
  try {
    if (typeof html2canvas === 'undefined' || typeof jsPDF === 'undefined') {
      throw new Error('필요한 라이브러리가 로드되지 않았습니다.');
    }

    // PDF로 저장할 컨텐츠 영역
    const element = document.getElementById('pdf-content');

    // 모바일 환경 체크
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // 모바일 환경에서의 최적화된 옵션
    const options = {
      scale: window.devicePixelRatio || 2, // 디바이스 픽셀 비율 적용
      useCORS: true, // CORS 이미지 허용
      logging: false, // 로깅 비활성화
      backgroundColor: '#ffffff', // 배경색 설정
      windowWidth: element.scrollWidth, // 요소의 실제 너비
      windowHeight: element.scrollHeight, // 요소의 실제 높이
      scrollX: window.scrollX, // 현재 스크롤 위치
      scrollY: window.scrollY
    };

    // HTML을 캔버스로 변환
    const canvas = await html2canvas(element, options);

    // PDF 크기 계산
    let pdfWidth, pdfHeight;

    if (isMobile) {
      // 모바일에서는 A4 비율을 유지하면서 내용이 잘리지 않도록 조정
      const contentRatio = canvas.height / canvas.width;
      pdfWidth = 210; // A4 너비 (mm)
      pdfHeight = pdfWidth * contentRatio;
    } else {
      // 데스크톱에서는 A4 크기 유지
      pdfWidth = 210; // A4 너비 (mm)
      pdfHeight = 297; // A4 높이 (mm)
    }

    // PDF 생성 (더 높은 품질 설정)
    const pdf = new jsPDF({
      orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
      unit: 'mm',
      format: [pdfWidth, pdfHeight]
    });

    // 이미지 품질 향상을 위한 설정
    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    // 이미지를 PDF 크기에 맞게 추가
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    return pdf;
  } catch (error) {
    console.error('PDF 생성 중 오류 발생:', error);
    throw new Error(`PDF 생성 중 오류가 발생했습니다: ${error.message}`);
  }
}

// 메인 이벤트 핸들러
document.addEventListener('DOMContentLoaded', () => {
  try {
    // localStorage 초기화 (이전 데이터만 초기화)
    const currentType = localStorage.getItem('isStudent') === 'true' ? 'student' : 'adult';
    const otherType = currentType === 'student' ? 'adult' : 'student';

    // 현재 진행 중인 설문조사의 데이터는 유지하고, 다른 설문조사의 데이터만 초기화
    localStorage.removeItem(`${otherType}Scores`);

    // 성인/학생 구분 플래그 확인
    const isStudent = localStorage.getItem('isStudent') === 'true';

    // 점수 데이터 가져오기 및 유효성 검사
    const scores = JSON.parse(localStorage.getItem(isStudent ? 'studentScores' : 'adultScores') || '[]');
    const expectedLength = isStudent ? 32 : 48;
    if (!scores || scores.length !== expectedLength) {
      const errorType = isStudent ? '학생용' : '성인용';
      throw new Error(`${errorType} 설문조사의 모든 질문에 답변해 주세요.`);
    }

    // MBTI 유형 계산
    const mbtiType = calcMBTI(scores, isStudent);

    // 결과 데이터 가져오기
    const resultData = isStudent ? mbtiDescriptionsStudent[mbtiType] : mbtiDescriptionsAdult[mbtiType];
    if (!resultData) {
      throw new Error('해당 MBTI 유형의 결과 데이터를 찾을 수 없습니다.');
    }

    // 결과 표시
    document.getElementById('mbti-type').textContent = `${mbtiType} (${resultData.name})`;
    document.getElementById('mbti-desc').textContent = resultData.desc;
    document.getElementById('recommend').textContent = resultData.recommend;

    // 성경 인물/구절 표시
    const oldTestament = mbtiBibleMap[mbtiType].old;
    const newTestament = mbtiBibleMap[mbtiType].new;

    // 구약 카드
    document.getElementById('old-testament').innerHTML = `
      <div class="bible-card">
        <h3>구약 인물</h3>
        <p class="bible-person">${oldTestament.name}</p>
        <p class="bible-verse">${oldTestament.verse}</p>
        <p class="bible-text">${oldTestament.text}</p>
      </div>
    `;

    // 신약 카드
    document.getElementById('new-testament').innerHTML = `
      <div class="bible-card">
        <h3>신약 인물</h3>
        <p class="bible-person">${newTestament.name}</p>
        <p class="bible-verse">${newTestament.verse}</p>
        <p class="bible-text">${newTestament.text}</p>
      </div>
    `;

    // 차트 생성
    createMBTIChart(scores, isStudent);

    // SWOT 분석 표시
    const swot = getSWOT(mbtiType, isStudent);
    document.getElementById('strengths').innerHTML = `<h3>강점</h3><ul>${swot.strengths.map(item => `<li>${item}</li>`).join('')}</ul>`;
    document.getElementById('weaknesses').innerHTML = `<h3>약점</h3><ul>${swot.weaknesses.map(item => `<li>${item}</li>`).join('')}</ul>`;
    document.getElementById('opportunities').innerHTML = `<h3>기회</h3><ul>${swot.opportunities.map(item => `<li>${item}</li>`).join('')}</ul>`;
    document.getElementById('threats').innerHTML = `<h3>위협</h3><ul>${swot.threats.map(item => `<li>${item}</li>`).join('')}</ul>`;

    // PDF 저장 버튼 이벤트 리스너
    document.getElementById('save-pdf').addEventListener('click', async () => {
      try {
        // 버튼 숨김
        document.querySelector('.result-btns').style.display = 'none';

        // PDF 생성
        const pdf = await generatePDF();

        // 데스크톱 환경에서는 다운로드
        pdf.save('MBTI_결과.pdf');

        // 버튼 다시 표시
        setTimeout(() => {
          document.querySelector('.result-btns').style.display = 'flex';
        }, 1000);
      } catch (error) {
        console.error('PDF 저장 중 오류 발생:', error);
        alert(`PDF 저장 중 오류가 발생했습니다: ${error.message}`);
        document.querySelector('.result-btns').style.display = 'flex';
      }
    });

  } catch (error) {
    console.error('결과 표시 중 오류 발생:', error);
    alert(error.message);
    window.location.href = 'index.html';
  }
});
