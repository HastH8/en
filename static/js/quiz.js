let quizState = {
    correctAnswers: 0,
    currentQuestion: 0,
    totalQuestions: document.querySelectorAll('.question-card').length,
    userAnswers: [],
    groupName: ''
};

// Add event listeners to all option buttons when the page loads
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.option-button').forEach(button => {
        button.addEventListener('click', function() {
            const questionCard = this.closest('.question-card');
            const questionIndex = questionCard.dataset.question;
            const selectedAnswer = this.textContent.trim();
            checkAnswer(questionIndex, selectedAnswer);
        });
    });
    
});
document.addEventListener('DOMContentLoaded', generateQuizQR);


function startQuiz() {
    const groupNameInput = document.getElementById('group-name');
    const groupName = groupNameInput.value.trim();
    
    if (!groupName) {
        alert('Please enter a group name');
        return;
    }
    
    quizState.groupName = groupName;
    localStorage.setItem('groupName', groupName);
    
    // Update the group display in stats
    document.getElementById('group-display').textContent = groupName;
    
    // Hide group selection and show quiz
    document.getElementById('group-selection').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';
    
    // Show first question
    document.querySelector('.question-card[data-question="0"]').style.display = 'block';
}

function checkAnswer(questionIndex, selectedAnswer) {
    const currentCard = document.querySelector(`.question-card[data-question="${questionIndex}"]`);
    const buttons = currentCard.querySelectorAll('.option-button');
    
    if (currentCard.querySelector('.option-button:disabled')) {
        return;
    }
    
    fetch('/check_answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            questionIndex: questionIndex,
            answer: selectedAnswer.trim(),
            groupName: quizState.groupName
        })
    })
    .then(response => response.json())
    .then(data => {
        quizState.userAnswers[questionIndex] = {
            selected: selectedAnswer,
            correct: data.correct,
            correctAnswer: quiz_questions[questionIndex].correct // Store the correct answer
        };
        
        if (data.correct) {
            quizState.correctAnswers++;
        }
        
        buttons.forEach(btn => {
            if (btn.textContent.trim() === selectedAnswer.trim()) {
                btn.style.backgroundColor = data.correct ? '#4ade80' : '#f87171';
                btn.style.color = 'white';
            }
            btn.disabled = true;
        });

        updateStats();
        currentCard.querySelector('.next-button').style.display = 'block';
    });
}

function showNextQuestion() {
    const currentCard = document.querySelector(`.question-card[data-question="${quizState.currentQuestion}"]`);
    currentCard.style.display = 'none';
    
    quizState.currentQuestion++;
    if (quizState.currentQuestion < quizState.totalQuestions) {
        const nextCard = document.querySelector(`.question-card[data-question="${quizState.currentQuestion}"]`);
        
        // Reset all buttons in the next question
        nextCard.querySelectorAll('.option-button').forEach(btn => {
            btn.disabled = false;
            btn.style.backgroundColor = '';
            btn.style.color = '';
        });
        
        // Hide the next button until new selection is made
        nextCard.querySelector('.next-button').style.display = 'none';
        
        nextCard.style.display = 'block';
        document.getElementById('current-question').textContent = quizState.currentQuestion + 1;
    } else {
        showQuizComplete();
    }
}

function showQuizComplete() {
    let resultsHTML = `
        <div class="quiz-complete">
            <h2>Quiz Complete!</h2>
            <p>You got ${quizState.correctAnswers} out of ${quizState.totalQuestions} questions correct.</p>
            <div class="answers-review">
                ${quiz_questions.map((question, index) => `
                    <div class="answer-item ${quizState.userAnswers[index].correct ? 'correct' : 'incorrect'}">
                        <h4>Question ${index + 1}</h4>
                        <p>${question.question}</p>
                        <p>Your answer: ${quizState.userAnswers[index].selected}</p>
                        ${!quizState.userAnswers[index].correct ? 
                            `<p>Correct answer: ${question.correct}</p>` : ''}
                    </div>
                `).join('')}
            </div>
            <button onclick="location.reload()" class="retry-button">Try Again</button>
        </div>
    `;
    
    document.getElementById('quiz-content').innerHTML = resultsHTML;
}


function updateStats() {
    document.getElementById('correct-answers').textContent = quizState.correctAnswers;
}

function generateQuizQR() {
    const quizURL = window.location.href;
    const qrcode = new QRCode(document.getElementById("qrcode"), {
        text: quizURL,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}
