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

// MBTI 16유형별 상세 결과 해석 (성인용)
const mbtiDescriptionsAdult = {
  ISTJ: {
    name: "ISTJ (청렴결백한 현실주의자)",
    desc: "책임감이 강하고 신중하며, 말씀과 원칙을 소중히 여깁니다. 교회 내 행정, 재정, 질서유지, 봉사 등에서 탁월함을 보일 수 있습니다. 묵묵히 주어진 사명을 완수하는 신실한 일꾼입니다.",
    recommend: "예배위원, 재정/행정팀, 봉사팀, 질서유지 사역"
  },
  ISFJ: {
    name: "ISFJ (용감한 수호자)",
    desc: "섬세하고 따뜻하며 헌신적으로 타인을 돌봅니다. 교회 내에서 돌봄, 상담, 식사/환영 사역 등에 적합하며, 조용히 사랑을 실천하는 모습이 아름답습니다.",
    recommend: "환영팀, 상담/돌봄, 식사/친교, 중보기도 사역"
  },
  INFJ: {
    name: "INFJ (선의의 옹호자)",
    desc: "깊은 통찰력과 비전을 가진 영적 리더입니다. 말씀 묵상, 영적 지도, 중보기도, 비전 제시 등에서 강점을 보입니다. 공동체를 위한 영적 나침반 역할을 할 수 있습니다.",
    recommend: "중보기도, 말씀나눔, 영적멘토, 비전팀"
  },
  INTJ: {
    name: "INTJ (용의주도한 전략가)",
    desc: "분석적이고 체계적인 사고로 교회의 미래와 방향을 모색합니다. 기획, 전략, 리더십, 연구 등에서 두각을 나타낼 수 있습니다.",
    recommend: "기획/전략팀, 리더십, 연구, IT/미디어 사역"
  },
  ISTP: {
    name: "ISTP (만능 재주꾼)",
    desc: "실용적이고 문제 해결에 능하며, 봉사 현장이나 기술적 지원에서 강점을 보입니다. 손으로 하는 봉사, 시설 관리, 영상/음향 등에서 빛을 발합니다.",
    recommend: "시설관리, 음향/영상, 기술 지원, 봉사팀"
  },
  ISFP: {
    name: "ISFP (호기심 많은 예술가)",
    desc: "따뜻하고 감성적이며, 예술적 재능으로 예배와 공동체에 아름다움을 더합니다. 찬양, 미술, 장식, 꽃꽂이 등에서 섬김이 가능합니다.",
    recommend: "찬양팀, 미술/장식, 꽃꽂이, 디자인 사역"
  },
  INFP: {
    name: "INFP (열정적인 중재자)",
    desc: "이상과 신념이 뚜렷하며, 말씀 묵상과 글쓰기, 창작, 상담 등에서 은혜를 나눕니다. 조용히 깊은 공감으로 사람들을 위로합니다.",
    recommend: "문서/출판, 상담, 묵상모임, 창작 사역"
  },
  INTP: {
    name: "INTP (논리적인 사색가)",
    desc: "탐구심이 많고 새로운 신학적 질문과 연구, 토론에 열정적입니다. 성경공부, 자료정리, IT, 연구사역에 적합합니다.",
    recommend: "성경공부, 연구, 자료정리, IT/미디어 사역"
  },
  ESTP: {
    name: "ESTP (모험을 즐기는 사업가)",
    desc: "즉흥적이고 활동적이며, 현장 사역과 대외활동, 이벤트, 봉사 등에서 에너지가 넘칩니다. 전도, 행사, 스포츠 사역에 강점이 있습니다.",
    recommend: "전도팀, 행사기획, 스포츠/레크리에이션, 봉사팀"
  },
  ESFP: {
    name: "ESFP (자유로운 영혼의 연예인)",
    desc: "사교적이고, 친구들과 노는 것을 좋아합니다. 공동체 분위기를 밝게 만듭니다. 찬양, 환영, 친교, 행사 등에서 활약할 수 있습니다.",
    recommend: "찬양팀, 환영/친교, 행사팀, 레크리에이션"
  },
  ENFP: {
    name: "ENFP (재기발랄한 활동가)",
    desc: "창의적이고, 새로운 아이디어와 비전을 제시합니다. 친구들과 함께하는 활동, 기획, 발표에 강점이 있습니다.",
    recommend: "청년부, 소그룹리더, 선교, 기획/홍보팀"
  },
  ENTP: {
    name: "ENTP (뜨거운 논쟁가)",
    desc: "창의적이고 논리적이며, 토론과 기획, 새로운 사역 개척에 관심이 많습니다. 기획, 토론, 연구, 미디어 사역에 적합합니다.",
    recommend: "기획/연구팀, 토론모임, 미디어, 새 사역 개척"
  },
  ESTJ: {
    name: "ESTJ (엄격한 관리자)",
    desc: "조직적이고 실용적이며, 질서와 규율을 중시합니다. 교회 내 행정, 조직 관리, 재정, 봉사 등에서 리더십을 발휘합니다.",
    recommend: "행정/재정팀, 조직관리, 봉사팀, 리더십"
  },
  ESFJ: {
    name: "ESFJ (사교적인 외교관)",
    desc: "사람을 잘 돌보고, 공동체 내 화목과 친교를 이끕니다. 환영, 친교, 식사, 돌봄, 상담 등에서 섬김이 두드러집니다.",
    recommend: "환영/친교, 식사/돌봄, 상담, 중보기도"
  },
  ENFJ: {
    name: "ENFJ (정의로운 사회운동가)",
    desc: "타인을 이끄는 리더십과 따뜻한 공감 능력으로 공동체를 세웁니다. 소그룹, 리더, 중보기도, 상담 등에서 영향력을 발휘합니다.",
    recommend: "소그룹리더, 중보기도, 상담, 공동체 리더"
  },
  ENTJ: {
    name: "ENTJ (대담한 통솔자)",
    desc: "목표지향적이고 전략적이며, 비전과 기획, 리더십이 뛰어납니다. 교회 내 리더, 기획, 전략, 대외사역에 적합합니다.",
    recommend: "리더십, 기획/전략팀, 대외사역, 선교"
  }
};

// MBTI 16유형별 상세 결과 해석 (학생용)
const mbtiDescriptionsStudent = {
  ISTJ: {
    name: "ISTJ (성실한 책임자)",
    desc: "규칙을 잘 지키고, 맡은 일에 책임감이 강해요. 조용히 자기 역할을 다하는 친구입니다.",
    recommend: "질서유지, 준비물 챙기기, 기록 담당"
  },
  ISFJ: {
    name: "ISFJ (따뜻한 도우미)",
    desc: "친구를 잘 챙기고, 배려심이 많아요. 다른 친구를 돕는 일에 기쁨을 느낍니다.",
    recommend: "친구 돌보기, 환영/친교, 봉사활동"
  },
  INFJ: {
    name: "INFJ (조용한 조언자)",
    desc: "생각이 깊고, 친구의 고민을 잘 들어줍니다. 조용히 응원해주는 따뜻한 친구입니다.",
    recommend: "상담, 글쓰기, 조용한 봉사"
  },
  INTJ: {
    name: "INTJ (계획하는 전략가)",
    desc: "계획을 잘 세우고, 새로운 아이디어를 생각하는 데 능해요. 프로젝트나 기획 활동에 강점이 있습니다.",
    recommend: "프로젝트 기획, 자료정리, 연구활동"
  },
  ISTP: {
    name: "ISTP (실용적인 해결사)",
    desc: "문제를 빠르게 해결하고, 손재주가 좋습니다. 실습, 만들기, 실용적 활동에 강합니다.",
    recommend: "실습, 만들기, 도구 사용, 봉사"
  },
  ISFP: {
    name: "ISFP (감성적인 예술가)",
    desc: "따뜻하고 감성적이며, 예술적 재능이 있습니다. 그림, 음악, 장식, 꽃꽂이 등에서 즐거움을 느낍니다.",
    recommend: "미술, 음악, 장식, 꾸미기"
  },
  INFP: {
    name: "INFP (이상적인 중재자)",
    desc: "마음이 따뜻하고, 자신의 신념을 소중히 여깁니다. 글쓰기, 창작, 친구 위로에 강점이 있습니다.",
    recommend: "글쓰기, 창작, 친구 위로"
  },
  INTP: {
    name: "INTP (호기심 많은 탐구자)",
    desc: "새로운 것을 배우고, 궁금한 것이 많아요. 탐구, 연구, 실험 활동에 흥미가 많습니다.",
    recommend: "탐구활동, 연구, 실험"
  },
  ESTP: {
    name: "ESTP (활동적인 해결사)",
    desc: "에너지가 넘치고, 직접 몸으로 부딪혀 배우는 것을 좋아합니다. 운동, 현장체험, 이벤트 활동에 강점이 있습니다.",
    recommend: "운동, 체험활동, 이벤트"
  },
  ESFP: {
    name: "ESFP (분위기 메이커)",
    desc: "사교적이고, 친구들과 노는 것을 좋아합니다. 공동체 분위기를 밝게 만듭니다. 찬양, 환영, 친교, 행사 등에서 활약할 수 있습니다.",
    recommend: "모임 진행, 발표, 행사"
  },
  ENFP: {
    name: "ENFP (아이디어 뱅크)",
    desc: "창의적이고, 새로운 생각을 많이 해냅니다. 친구들과 함께하는 활동, 기획, 발표에 강점이 있습니다.",
    recommend: "기획, 발표, 그룹활동"
  },
  ENTP: {
    name: "ENTP (토론가)",
    desc: "토론을 좋아하고, 새로운 아이디어로 친구들을 이끕니다. 토론, 기획, 발표 활동에 적합합니다.",
    recommend: "토론, 기획, 발표"
  },
  ESTJ: {
    name: "ESTJ (실용적인 리더)",
    desc: "조직적이고, 친구들을 이끄는 리더십이 있습니다. 모임 진행, 역할 분담, 질서유지에 강점이 있습니다.",
    recommend: "모임 리더, 역할 분담, 질서유지"
  },
  ESFJ: {
    name: "ESFJ (친절한 친구)",
    desc: "친구를 잘 챙기고, 모두가 잘 어울리도록 돕습니다. 환영, 친교, 돌봄 활동에 적합합니다.",
    recommend: "환영, 친교, 돌봄"
  },
  ENFJ: {
    name: "ENFJ (이끄는 리더)",
    desc: "친구들을 잘 이끌고, 모두가 함께할 수 있도록 도와줍니다. 그룹 활동, 발표, 리더 역할에 강점이 있습니다.",
    recommend: "그룹리더, 발표, 조정 역할"
  },
  ENTJ: {
    name: "ENTJ (당찬 지도자)",
    desc: "목표를 세우고, 친구들을 이끌며, 큰 그림을 보는 능력이 있습니다. 프로젝트, 기획, 리더 역할에 적합합니다.",
    recommend: "프로젝트 리더, 기획, 발표"
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
  const mbtiDesc = mbtiDescriptionsStudent[mbtiType];
  description = `<h2>나의 MBTI: <span style='color:#4e54c8;'>${mbtiType}</span></h2>` +
    (bibleInfo ? `<div class='bible-matching'><strong>구약 대표:</strong> ${bibleInfo.old.name} (${bibleInfo.old.verse})<br><span style='color:#555;'>${bibleInfo.old.text}</span><br><strong>신약 대표:</strong> ${bibleInfo.new.name} (${bibleInfo.new.verse})<br><span style='color:#555;'>${bibleInfo.new.text}</span></div><hr>` : "") +
    `<h3>🧒 학생용 결과 해석</h3><p><strong>${mbtiDesc.name}</strong><br>${mbtiDesc.desc}</p><p><strong>추천 활동:</strong> ${mbtiDesc.recommend}</p>` +
    "<hr><h4>학생 MBTI 4축 해석</h4><p>이 학생은 " +
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
  const mbtiDesc = mbtiDescriptionsAdult[mbtiType];
  description = `<h2>나의 MBTI: <span style='color:#4e54c8;'>${mbtiType}</span></h2>` +
    (bibleInfo ? `<div class='bible-matching'><strong>구약 대표:</strong> ${bibleInfo.old.name} (${bibleInfo.old.verse})<br><span style='color:#555;'>${bibleInfo.old.text}</span><br><strong>신약 대표:</strong> ${bibleInfo.new.name} (${bibleInfo.new.verse})<br><span style='color:#555;'>${bibleInfo.new.text}</span></div><hr>` : "") +
    `<h3>🧑 성인용 결과 해석</h3><p><strong>${mbtiDesc.name}</strong><br>${mbtiDesc.desc}</p><p><strong>추천 사역:</strong> ${mbtiDesc.recommend}</p>` +
    "<hr><h4>성인 MBTI 4축 해석</h4><p>당신은 " +
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
