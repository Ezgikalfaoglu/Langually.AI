// quiz.js - Quiz Generation Logic (FR6, FR10)

let currentQuestions = [];
let currentIndex = 0;
let score = 0;

document.addEventListener('DOMContentLoaded', loadQuiz);

async function loadQuiz() {
    const res = await API.getQuiz();
    if (res && res.questions) {
        currentQuestions = res.questions;
        showQuestion(0);
    }
}

function showQuestion(index) {
    currentIndex = index;
    const q = currentQuestions[index];
    document.getElementById('question-text').innerText = q.q;
    document.getElementById('question-count').innerText = `Question ${index + 1} / ${currentQuestions.length}`;

    const container = document.getElementById('options-container');
    container.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.classList.add('stat-card'); // reusing card style
        btn.style.textAlign = 'left';
        btn.style.width = '100%';
        btn.style.cursor = 'pointer';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, q.answer);
        container.appendChild(btn);
    });

    document.getElementById('result-area').style.display = 'none';
}

function checkAnswer(selected, correct) {
    const isCorrect = selected === correct;
    const msg = document.getElementById('result-msg');

    if (isCorrect) {
        score++;
        msg.innerText = "✅ Correct!";
        msg.style.color = "#4ade80";
    } else {
        msg.innerText = `❌ Incorrect. Answer: ${correct}`;
        msg.style.color = "#f87171";
    }

    document.getElementById('result-area').style.display = 'block';

    // Disable buttons
    const btns = document.querySelectorAll('#options-container button');
    btns.forEach(b => b.disabled = true);
}

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentIndex + 1 < currentQuestions.length) {
        showQuestion(currentIndex + 1);
    } else {
        // Finish Quiz
        document.getElementById('quiz-container').innerHTML = `
            <div style="text-align:center;">
                <h2>Quiz Completed!</h2>
                <p style="font-size: 2rem; margin: 1rem;">Score: ${score} / ${currentQuestions.length}</p>
                <button class="send-btn" onclick="window.location.reload()">New Quiz</button>
            </div>
        `;
    }
});
