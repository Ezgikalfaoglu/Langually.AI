// writing.js - Writing Evaluation (FR7)

document.getElementById('submit-btn').addEventListener('click', async () => {
    const text = document.getElementById('writing-input').value;
    if (!text) return alert("Please type something.");

    document.getElementById('submit-btn').innerText = "Analyzing...";

    const res = await API.analyzeWriting(text); // { score: 85, strengths: [], improvements: [] }

    document.getElementById('submit-btn').innerText = "Analyze Text";

    if (res) {
        document.getElementById('feedback-panel').style.display = 'block';
        document.getElementById('score-val').innerText = `${res.score}/100`;

        const sList = document.getElementById('strengths-list');
        sList.innerHTML = res.strengths.map(s => `<li>${s}</li>`).join('');

        const iList = document.getElementById('improvements-list');
        iList.innerHTML = res.improvements.map(i => `<li>${i}</li>`).join('');
    }
});
