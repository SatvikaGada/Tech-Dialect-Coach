
function getNewQuestion() {
    const categoryQuestions = questions[currentCategory];
    const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
    currentQuestionData = categoryQuestions[randomIndex];

    document.getElementById('current-question').textContent = currentQuestionData.text;
    document.getElementById('question-difficulty').textContent = 'Difficulty: Medium';
    document.getElementById('analysis-panel').classList.remove('show');
    document.getElementById('analyze-btn').disabled = true;
    showNotification('New question loaded! Start recording your response.');
}