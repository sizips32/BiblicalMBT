const studentScores = JSON.parse(localStorage.getItem('studentScores') || 'null');
const adultAnswers = JSON.parse(localStorage.getItem('adultAnswers') || 'null');

let labels = ['E-I', 'S-N', 'T-F', 'J-P'];
let scores = [];
let description = "";
let mbtiType = "";

// MBTI별 성경 인물/구절 매핑
const mbtiBibleMap = {
  ISTJ: {
    old: { name: '모세', verse: '출애굽기 18:24', text: '모세가 그의 장인의 말을 듣고 그 모든 말대로 하여…' },
    new: { name: '야고보', verse: '야고보서 2:17', text: '이와 같이 행함이 없는 믿음은 그 자체가 죽은 것이라.' }
  },
  ISFJ: {
    old: { name: '룻', verse: '룻기 1:16', text: '어머니의 백성이 나의 백성이 되고, 어머니의 하나님이 나의 하나님이 되시리니…' },
    new: { name: '마리아(예수 어머니)', verse: '누가복음 2:51', text: '그 어머니는 이 모든 말을 마음에 두니라.' }
  },
  INFJ: {
    old: { name: '사무엘', verse: '사무엘상 3:19-20', text: '사무엘이 자라매 여호와께서 그와 함께 계셔서…' },
    new: { name: '요한', verse: '요한복음 13:23', text: '예수의 제자 중 하나, 곧 그가 사랑하시는 자가 예수의 품에 기대어…' }
  },
  INTJ: {
    old: { name: '다니엘', verse: '다니엘 6:10', text: '다니엘이 이 조서에 왕의 도장이 찍힌 것을 알고도…' },
    new: { name: '바울', verse: '로마서 12:2', text: '이 세대를 본받지 말고 오직 마음을 새롭게 함으로 변화를 받아…' }
  },
  ISTP: {
    old: { name: '엘리야', verse: '열왕기상 18:36-37', text: '엘리야가 나아가서 말하되…' },
    new: { name: '도마', verse: '요한복음 20:27-28', text: '도마에게 이르시되 네 손가락을 이리 내밀어…' }
  },
  ISFP: {
    old: { name: '다윗', verse: '시편 23:1-2', text: '여호와는 나의 목자시니 내게 부족함이 없으리로다…' },
    new: { name: '마르다', verse: '누가복음 10:41-42', text: '주께서 대답하여 이르시되 마르다야 마르다야…' }
  },
  INFP: {
    old: { name: '예레미야', verse: '예레미야 1:5-9', text: '내가 너를 모태에서 짓기 전에 너를 알았고…' },
    new: { name: '디모데', verse: '디모데후서 1:5-7', text: '이는 네 속에 거짓이 없는 믿음이 있음을 생각함이라…' }
  },
  INTP: {
    old: { name: '솔로몬', verse: '열왕기상 3:9-12', text: '누가 주의 이 많은 백성을 재판할 수 있사오리이까…' },
    new: { name: '누가', verse: '골로새서 4:14', text: '사랑을 받는 의원 누가와…' }
  },
  ESTP: {
    old: { name: '삼손', verse: '사사기 14:6', text: '여호와의 영이 삼손에게 강하게 임하매…' },
    new: { name: '베드로', verse: '마태복음 14:29', text: '베드로가 배에서 내려 물 위로 걸어서…' }
  },
  ESFP: {
    old: { name: '삼엘', verse: '사무엘상 16:12-13', text: '사무엘이 기름을 부으니…' },
    new: { name: '마리아(막달라)', verse: '누가복음 8:2-3', text: '일곱 귀신이 나간 마리아…' }
  },
  ENFP: {
    old: { name: '요셉', verse: '창세기 41:39-40', text: '바로가 요셉에게 이르되…' },
    new: { name: '베드로', verse: '사도행전 2:14', text: '베드로가 열한 사도와 함께 서서…' }
  },
  ENTP: {
    old: { name: '요나', verse: '요나 1:1-3', text: '여호와의 말씀이 요나에게 임하니라…' },
    new: { name: '바울', verse: '사도행전 17:22-23', text: '바울이 아레오바고 가운데 서서 말하되…' }
  },
  ESTJ: {
    old: { name: '여호수아', verse: '여호수아 1:7-9', text: '오직 강하고 극히 담대하여…' },
    new: { name: '빌립', verse: '사도행전 6:5-6', text: '빌립과 브로고로와…' }
  },
  ESFJ: {
    old: { name: '아론', verse: '출애굽기 4:14-16', text: '그가 네 말을 대신하여…' },
    new: { name: '마르다', verse: '요한복음 11:21-22', text: '마르다가 예수께 여짜오되…' }
  },
  ENFJ: {
    old: { name: '모세', verse: '민수기 12:7-8', text: '내 종 모세와는 내가 대면하여…' },
    new: { name: '베드로', verse: '요한복음 21:15-17', text: '내 어린 양을 먹이라…' }
  },
  ENTJ: {
    old: { name: '느헤미야', verse: '느헤미야 2:17-18', text: '느헤미야가 그들에게 이르되…' },
    new: { name: '바울', verse: '고린도전서 9:22-23', text: '내가 여러 사람에게 여러 모습이 된 것은…' }
  }
};

// MBTI 계산 함수 (2지선다/6점척도 모두 지원)
function calcMBTI(scores) {
  if (scores.length !== 24) return "?";
  let ei = 0, sn = 0, tf = 0, jp = 0;
  for (let i = 0; i < 6; i++) ei += (scores[i] === 0 ? 1 : -1);
  for (let i = 6; i < 12; i++) sn += (scores[i] === 0 ? 1 : -1);
  for (let i = 12; i < 18; i++) tf += (scores[i] === 0 ? 1 : -1);
  for (let i = 18; i < 24; i++) jp += (scores[i] === 0 ? 1 : -1);
  return `${ei >= 0 ? 'E' : 'I'}${sn >= 0 ? 'N' : 'S'}${tf >= 0 ? 'T' : 'F'}${jp >= 0 ? 'J' : 'P'}`;
}

let bibleInfo = null;

if (studentScores) {
  if (studentScores.length === 24) {
    mbtiType = calcMBTI(studentScores);
    bibleInfo = mbtiBibleMap[mbtiType];
  }
  scores = [
    studentScores.slice(0, 6).reduce((a, b) => a + (b === 0 ? 1 : 0), 0),
    studentScores.slice(6, 12).reduce((a, b) => a + (b === 0 ? 1 : 0), 0),
    studentScores.slice(12, 18).reduce((a, b) => a + (b === 0 ? 1 : 0), 0),
    studentScores.slice(18, 24).reduce((a, b) => a + (b === 0 ? 1 : 0), 0)
  ];
  description = `<h2>나의 MBTI: <span style='color:#4e54c8;'>${mbtiType}</span></h2>` +
    (bibleInfo ? `<div class='bible-matching'><strong>구약 대표:</strong> ${bibleInfo.old.name} (${bibleInfo.old.verse})<br><span style='color:#555;'>${bibleInfo.old.text}</span><br><strong>신약 대표:</strong> ${bibleInfo.new.name} (${bibleInfo.new.verse})<br><span style='color:#555;'>${bibleInfo.new.text}</span></div><hr>` : "") +
    "<h3>🧒 학생용 결과 해석</h3><p>이 학생은 " +
    (scores[0] >= 3 ? "활동적이고 친구들과 어울리는 것을 좋아하며," : "조용히 혼자 있는 것을 선호하고,") +
    (scores[1] >= 3 ? " 새로운 것을 탐구하고 상상하는 데 흥미가 있으며," : " 현재 상황에 집중하고 계획적으로 움직이며,") +
    (scores[2] >= 3 ? " 공정성과 이성적 판단을 중시하고," : " 타인의 감정을 잘 이해하고 공감할 수 있으며,") +
    (scores[3] >= 3 ? " 계획적으로 움직이는 것을 선호합니다." : " 즉흥적으로 성령의 인도에 민감하게 반응합니다.") +
    "</p><p><strong>👩‍🏫 교사용 제안:</strong> 이 학생에게는 " +
    (scores[0] >= 3 ? "활동 중심의 그룹 성경공부" : "개인 묵상과 조용한 활동") +
    "이 도움이 될 수 있습니다.";
} else if (adultAnswers) {
  if (adultAnswers.length === 24) {
    let binScores = adultAnswers.map(v => v <= 3 ? 0 : 1);
    mbtiType = calcMBTI(binScores);
    bibleInfo = mbtiBibleMap[mbtiType];
  }
  scores = [
    average(adultAnswers.slice(0, 6)),
    average(adultAnswers.slice(6, 12)),
    average(adultAnswers.slice(12, 18)),
    average(adultAnswers.slice(18, 24))
  ];
  description = `<h2>나의 MBTI: <span style='color:#4e54c8;'>${mbtiType}</span></h2>` +
    (bibleInfo ? `<div class='bible-matching'><strong>구약 대표:</strong> ${bibleInfo.old.name} (${bibleInfo.old.verse})<br><span style='color:#555;'>${bibleInfo.old.text}</span><br><strong>신약 대표:</strong> ${bibleInfo.new.name} (${bibleInfo.new.verse})<br><span style='color:#555;'>${bibleInfo.new.text}</span></div><hr>` : "") +
    "<h3>🧑 성인용 결과 해석</h3><p>당신은 " +
    (scores[0] >= 3 ? "사람들과 함께 사역하고 복음을 나누는 것을 좋아하며," : "개인적인 묵상과 기도로 주님께 나아가는 것을 중요하게 여기고,") +
    (scores[1] >= 3 ? " 미래에 대한 비전과 인도하심에 집중하며," : " 현재와 실제적인 상황에 충실하며,") +
    (scores[2] >= 3 ? " 이성과 판단력에 따라 행동하고," : " 사랑과 긍휼로 사람을 대하는 것을 중요하게 여기며,") +
    (scores[3] >= 3 ? " 질서와 계획을 중시하는 성향입니다." : " 유연하게 성령의 인도하심에 따르는 삶을 추구합니다.") +
    "</p><p><strong>👥 적용 제안:</strong> 이 성도님은 " +
    (scores[0] >= 3 ? "소그룹 리더십이나 전도 활동" : "묵상 및 중보기도 사역") +
    "에 잘 어울릴 수 있습니다.";
}

document.getElementById('swot-section').innerHTML =
  description + getSWOT(scores.map(s => (s >= 3 ? '강' : '약')));

new Chart(document.getElementById('resultRadar'), {
  type: 'radar',
  data: {
    labels: labels,
    datasets: [{
      label: studentScores ? '학생 성향 점수' : 'MBTI 성향 점수',
      data: scores,
      backgroundColor: studentScores ? 'rgba(153,102,255,0.2)' : 'rgba(75,192,192,0.2)',
      borderColor: studentScores ? 'rgba(153,102,255,1)' : 'rgba(75,192,192,1)',
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    scales: {
      r: {
        min: 1,
        max: 6,
        ticks: {
          stepSize: 1,
          color: '#333'
        }
      }
    }
  }
});

function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function getSWOT(type) {
  return `
    <h3>💪 강점 (Strengths)</h3>
    <p>${type[0] === '강' ? '복음 전도와 공동체 활동에 활발히 참여합니다.' : '깊이 있는 묵상과 집중력이 뛰어납니다.'}</p>
    <h3>🧩 약점 (Weaknesses)</h3>
    <p>${type[1] === '약' ? '새로운 시도보다는 익숙한 것에 머무를 수 있습니다.' : '현실적인 세부 사항을 놓칠 수 있습니다.'}</p>
    <h3>🌱 기회 (Opportunities)</h3>
    <p>${type[2] === '강' ? '공정하고 이성적인 판단을 바탕으로 신뢰를 얻습니다.' : '사람들과 감정적으로 잘 연결될 수 있습니다.'}</p>
    <h3>⚠️ 위협 (Threats)</h3>
    <p>${type[3] === '약' ? '계획 없이 흘러가며 마무리가 어려울 수 있습니다.' : '융통성이 부족해 보일 수 있습니다.'}</p>
  `;
}

document.getElementById('save-pdf').addEventListener('click', () => {
  import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js').then(() => {
    html2canvas(document.body).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const filename = studentScores ? '학생용_MBTI_결과.pdf' : '성인용_MBTI_결과.pdf';
      pdf.save(filename);
    });
  });
});
