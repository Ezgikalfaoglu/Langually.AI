const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Static frontend (opsiyonel)
app.use(express.static(path.join(__dirname, '../frontend')));

/* =========================
   JSON STORAGE (FAKE DB)
========================= */

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const FILES = {
  users: path.join(DATA_DIR, 'users.json'),
  chatLogs: path.join(DATA_DIR, 'chatLogs.json'),
  quizResults: path.join(DATA_DIR, 'quizResults.json'),
  writingSubmissions: path.join(DATA_DIR, 'writingSubmissions.json')
};

function loadData(file) {
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

function saveData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* =========================
   AUTH
========================= */

// REGISTER
app.post('/api/register', (req, res) => {
  const { username } = req.body;
  let users = loadData(FILES.users);

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    username,
    level: 'Beginner',
    xp: 0,
    createdAt: new Date()
  };

  users.push(newUser);
  saveData(FILES.users, users);

  res.json({ success: true, user: newUser });
});

// LOGIN
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  let users = loadData(FILES.users);

  let user = users.find(u => u.username === username);
  if (!user) {
    user = {
      username,
      level: 'Beginner',
      xp: 0,
      createdAt: new Date()
    };
    users.push(user);
    saveData(FILES.users, users);
  }

  res.json({
    success: true,
    token: 'mock-jwt-' + Date.now(),
    user
  });
});

/* =========================
   CHAT (MOCK AI)
========================= */

app.post('/api/chat', (req, res) => {
  const { username, message, mode } = req.body;

  const logs = loadData(FILES.chatLogs);
  logs.push({
    username,
    message,
    mode,
    date: new Date()
  });
  saveData(FILES.chatLogs, logs);

  const response =
    mode === 'explanation'
      ? `Explanation mode: "${message}" is used when talking about examples.`
      : `Practice feedback: Good try! Try correcting tense if needed.`;

  res.json({
    response,
    corrections: message.length < 5 ? ['Try writing longer sentences'] : []
  });
});

/* =========================
   QUIZ
========================= */

// GET QUIZ
app.get('/api/quiz', (req, res) => {
  res.json({
    questions: [
      {
        id: 1,
        question: "Past tense of 'go'?",
        options: ["went", "gone"],
        answer: "went"
      },
      {
        id: 2,
        question: "Plural of 'child'?",
        options: ["childs", "children"],
        answer: "children"
      }
    ]
  });
});

// SUBMIT QUIZ
app.post('/api/quiz/submit', (req, res) => {
  const { username, answers } = req.body;

  const score = answers.filter(a => a.correct).length;

  const results = loadData(FILES.quizResults);
  results.push({
    username,
    score,
    answers,
    date: new Date()
  });
  saveData(FILES.quizResults, results);

  res.json({
    success: true,
    score
  });
});

/* =========================
   DASHBOARD
========================= */

app.get('/api/dashboard', (req, res) => {
  res.json({
    xp: 1200,
    streak: 4,
    weakAreas: ['Past Tense', 'Vocabulary']
  });
});

/* =========================
   WRITING
========================= */

app.post('/api/writing/submit', (req, res) => {
  const { username, text } = req.body;

  const writings = loadData(FILES.writingSubmissions);

  const score = Math.min(100, text.length * 2);

  const entry = {
    username,
    text,
    score,
    feedback: {
      strengths: ['Clear meaning'],
      improvements: ['Check verb tense', 'Use connectors']
    },
    date: new Date()
  };

  writings.push(entry);
  saveData(FILES.writingSubmissions, writings);

  res.json({
    success: true,
    result: entry
  });
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
