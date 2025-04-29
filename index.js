// index.js
const nextButton = document.getElementById('next-button');
const mainScreen = document.getElementById('main-screen');
const selectScreen = document.getElementById('select-screen');

nextButton.addEventListener('click', () => {
  mainScreen.style.display = 'none';
  selectScreen.style.display = 'block';
});

function startSurvey(type) {
  if (type === 'adult') {
    localStorage.removeItem('adultAnswers');
    window.location.href = 'adult_survey.html';
  } else if (type === 'student') {
    localStorage.removeItem('studentScores');
    window.location.href = 'student_survey.html';
  }
}
