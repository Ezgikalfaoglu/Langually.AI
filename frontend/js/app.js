// Main SPA Logic
const app = {
    state: {
        user: null,
        token: null,
        currentMode: 'practice',
        isLoginMode: true
    },

    init: () => {
        console.log('Langually App Initialized');
    },

    // --- Authentication ---
    toggleAuth: () => {
        app.state.isLoginMode = !app.state.isLoginMode;
        const isLogin = app.state.isLoginMode;

        // Update UI Text
        document.getElementById('auth-btn-text').innerText = isLogin ? 'Start Learning Journey' : 'Create Account';
        document.getElementById('auth-toggle-text').innerText = isLogin ? "Don't have an account?" : "Already have an account?";
        document.getElementById('auth-toggle-action').innerText = isLogin ? 'Register' : 'Login';

        // Optional: Update header/welcome text if needed
    },

    login: async () => {
        const usernameInput = document.getElementById('username-input');
        const username = usernameInput.value.trim();

        if (!username) {
            alert("Please enter a username to start.");
            return;
        }

        // Simulate Register/Login difference (mock backend handles both same way for now)
        if (!app.state.isLoginMode) {
            console.log("Registering new user:", username);
            // In a real app, call API.register(username, password)
        }

        try {
            const res = await API.login(username);

            if (res.success) {
                app.state.user = res.user;
                app.state.token = res.token;
                localStorage.setItem('token', res.token);

                // Update UI
                document.getElementById('sidebar-username').innerText = res.user.username;
                document.getElementById('sidebar-avatar').innerText = res.user.username.charAt(0).toUpperCase();

                // Transition
                document.getElementById('auth-view').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('auth-view').style.display = 'none';
                    document.getElementById('app-structure').style.display = 'flex';
                    app.nav('dashboard');
                    app.loadDashboardData();
                }, 500);
            }
        } catch (err) {
            console.error(err);
            alert("Login failed. Check console.");
        }
    },

    // --- Navigation ---
    nav: (viewId, param = null) => {
        // Toggle Sidebar Active State
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.remove('active');
            // Check if this nav item onclick matches the current viewId
            if (el.getAttribute('onclick') && el.getAttribute('onclick').includes(`'${viewId}'`)) {
                el.classList.add('active');
            }
            // Fallback for sub-features if needed
            if (viewId === 'chat' && el.innerText.includes('AI Tutor')) el.classList.add('active');
        });

        // Hide all views
        document.querySelectorAll('.view').forEach(el => {
            el.classList.remove('active');
            el.style.opacity = '0';
            setTimeout(() => {
                if (!el.classList.contains('active')) el.style.display = 'none';
            }, 300); // Wait for fade out
        });

        // Show target view
        const target = document.getElementById(`view-${viewId}`);
        if (target) {
            target.style.display = 'block';
            setTimeout(() => target.classList.add('active'), 10);
        }

        // Specific View Logic
        if (viewId === 'chat' && param) {
            app.setChatMode(param);
        }
    },

    // --- Dashboard ---
    loadDashboardData: async () => {
        // In a real app, we'd fetch specific dashboard data. 
        // For now, reuse the user data or mock endpoint.
        const stats = await API.getProgress(); // Using the method from api.js
        if (stats) {
            document.getElementById('dash-streak').innerText = (stats.streak || app.state.user.streak || 0) + ' Days';
            document.getElementById('dash-xp').innerText = (stats.xp || app.state.user.xp || 0);
        }
    },

    // --- Chat ---
    setChatMode: (mode) => {
        app.state.currentMode = mode;
        const select = document.getElementById('chat-mode-select');
        if (select) select.value = mode; // Sync UI

        document.getElementById('chat-mode-display').innerText = mode.charAt(0).toUpperCase() + mode.slice(1) + ' Mode';

        // System message indicating mode switch
        app.addChatMessage(`Switched to ${mode} mode.`, 'ai', true);
    },

    sendMessage: async () => {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

        // 1. User Message
        app.addChatMessage(text, 'user');
        input.value = '';

        // 2. Loading State
        app.showTypingIndicator();

        // 3. API Call
        try {
            const res = await API.sendMessage(text, app.state.currentMode);

            app.removeTypingIndicator();

            if (res.response) {
                app.addChatMessage(res.response, 'ai');
            }
            if (res.corrections && res.corrections.length > 0) {
                app.addChatMessage(`💡 **Tip:** ${res.corrections.join(', ')}`, 'ai');
            }

        } catch (err) {
            app.removeTypingIndicator();
            app.addChatMessage("Error connecting to tutor.", 'ai');
        }
    },

    addChatMessage: (text, sender, isSystem = false) => {
        const box = document.getElementById('chat-box');
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        if (isSystem) {
            div.style.background = 'transparent';
            div.style.boxShadow = 'none';
            div.style.padding = '0.5rem';
            div.style.fontStyle = 'italic';
            div.style.color = 'var(--text-muted)';
            div.style.textAlign = 'center';
            div.style.width = '100%';
            div.style.maxWidth = '100%'; // Override .msg limit
            div.style.alignSelf = 'center';
        }
        div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Simple Markdown bold

        box.appendChild(div);
        box.scrollTop = box.scrollHeight;
    },

    showTypingIndicator: () => {
        const box = document.getElementById('chat-box');
        const div = document.createElement('div');
        div.id = 'typing-indicator';
        div.className = 'msg ai typing-indicator';
        div.innerHTML = '<span></span><span></span><span></span>';
        box.appendChild(div);
        box.scrollTop = box.scrollHeight;
    },

    removeTypingIndicator: () => {
        const el = document.getElementById('typing-indicator');
        if (el) el.remove();
    },

    // --- Quiz & Writing (Simplified) ---
    startQuiz: () => {
        const container = document.getElementById('quiz-container');
        container.style.display = 'block';
        container.innerHTML = `<div class="glass-card"><p>Loading questions...</p></div>`;

        API.getQuiz().then(data => {
            if (data && data.questions) {
                // Render first question for demo
                const q = data.questions[0];
                container.innerHTML = `
                    <div class="glass-card" style="text-align: left;">
                        <h3>Question 1</h3>
                        <p style="font-size: 1.2rem; margin: 1rem 0;">${q.question || q.q}</p>
                        <div style="display: grid; gap: 0.5rem;">
                            ${(q.options || []).map(opt => `<button class="btn btn-secondary" style="width:100%; justify-content:flex-start;">${opt}</button>`).join('')}
                        </div>
                    </div>
                `;
            }
        });
    },

    submitWriting: () => {
        const text = document.getElementById('writing-input').value;
        if (!text) return;

        const resDiv = document.getElementById('writing-result');
        resDiv.innerHTML = '<p>Analyzing...</p>';

        API.analyzeWriting(text).then(res => {
            resDiv.innerHTML = `
                <div class="glass-card" style="background: rgba(16, 185, 129, 0.1); border-color: var(--success);">
                    <h3 style="color: var(--success); margin-bottom: 0.5rem;">Score: ${res.score || 85}/100</h3>
                    <p><strong>Strengths:</strong> ${(res.feedback?.strengths || res.strengths || []).join(', ')}</p>
                    <p><strong>Improvements:</strong> ${(res.feedback?.improvements || res.improvements || []).join(', ')}</p>
                </div>
            `;
        });
    }
};

// Start
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
