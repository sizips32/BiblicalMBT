// index.js
const nextButton = document.getElementById('next-button');
const mainScreen = document.getElementById('main-screen');
const selectScreen = document.getElementById('select-screen');

nextButton.addEventListener('click', () => {
  mainScreen.style.display = 'none';
  selectScreen.style.display = 'block';
});

function startSurvey(type) {
  // 버튼 시각적 선택 효과 처리
  const selectBtns = document.querySelectorAll('.select-buttons button');
  selectBtns.forEach(btn => btn.classList.remove('selected'));
  if (type === 'adult') {
    selectBtns[0].classList.add('selected');
    setTimeout(() => {
      localStorage.removeItem('adultAnswers');
      window.location.href = 'adult_survey.html';
    }, 180); // 선택 효과 잠깐 보여주기
  } else if (type === 'student') {
    selectBtns[1].classList.add('selected');
    setTimeout(() => {
      localStorage.removeItem('studentScores');
      window.location.href = 'student_survey.html';
    }, 180);
  }
}
