// api.js - Shared API wrapper (FR4)
const API_BASE = 'http://localhost:3000/api';

class API {
    static async request(endpoint, method = 'GET', body = null) {
        const headers = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem('token');
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const config = { method, headers };
        if (body) config.body = JSON.stringify(body);

        try {
            const res = await fetch(`${API_BASE}${endpoint}`, config);
            if (!res.ok) throw new Error('Server Error');
            return await res.json();
        } catch (err) {
            console.warn(`Backend Offline (${err}). Switching to Mock Data.`);
            return this.getMockResponse(endpoint, method, body);
        }
    }

    // Fallback Mock Data for Demo Mode (Backend-less)
    static getMockResponse(endpoint, method, body) {
        return new Promise(resolve => {
            setTimeout(() => {
                if (endpoint === '/login') {
                    resolve({
                        success: true,
                        token: 'demo-token',
                        user: { username: body.username, xp: 500, streak: 1 }
                    });
                } else if (endpoint === '/progress') {
                    resolve({ streak: 3, xp: 1250 });
                } else if (endpoint === '/history') {
                    resolve({
                        logs: [
                            { message: "Previous mock session...", date: new Date(), mode: "practice" },
                            { message: "Another saved chat...", date: new Date(), mode: "practice" }
                        ]
                    });
                } else if (endpoint === '/chat') {
                    let response = `[OFFLINE MODE] You said: "${body.message}". (Server is not running)`;
                    if (body.mode === 'quiz') response = "Quiz Mode response (Offline).";
                    else if (body.mode === 'explanation') response = "Explanation Mode response (Offline).";
                    resolve({ response, corrections: [] });
                } else if (endpoint === '/quiz/generate') {
                    resolve({
                        questions: [
                            { q: "[OFFLINE] Past tense of 'Run'?", options: ["Ran", "Runned", "Running"], answer: "Ran" },
                            { q: "[OFFLINE] I ___ happy.", options: ["am", "is", "be"], answer: "am" },
                            { q: "[OFFLINE] They ___ football.", options: ["play", "plays", "playing"], answer: "play" }
                        ]
                    });
                } else if (endpoint === '/writing/analyze') {
                    resolve({
                        score: 88,
                        strengths: ["[OFFLINE] Good flow", "Clear intent"],
                        improvements: ["Check backend connection", "Expand vocabulary"]
                    });
                } else {
                    resolve({ success: true });
                }
            }, 500); // Simulate network delay
        });
    }

    static async login(username) { return this.request('/login', 'POST', { username }); }
    static async getProgress() { return this.request('/progress'); }
    static async getHistory() { return this.request('/history'); }
    static async sendMessage(message, mode) { return this.request('/chat', 'POST', { message, mode }); }
    static async getQuiz() { return this.request('/quiz/generate'); }
    static async analyzeWriting(text) { return this.request('/writing/analyze', 'POST', { text }); }
}
