// auth.js - Authentication Logic (FR1)

// On Page Load: Check session if not on Login page
document.addEventListener('DOMContentLoaded', () => {
    const isLoginPage = window.location.pathname.includes('login.html');
    const user = localStorage.getItem('user');

    if (!user && !isLoginPage) {
        window.location.href = 'login.html';
    } else if (user && isLoginPage) {
        window.location.href = 'dashboard.html';
    }

    // Sidebar User Display
    const userDisplay = document.getElementById('user-display');
    const avatar = document.getElementById('avatar-initial');
    if (userDisplay && user) {
        userDisplay.innerText = user;
        avatar.innerText = user.charAt(0).toUpperCase();
    }
});

// Login Logic
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        if (!username) return alert('Please enter a username');

        const res = await API.login(username);
        if (res.success) {
            localStorage.setItem('user', res.user.username);
            localStorage.setItem('token', res.token);
            window.location.href = 'dashboard.html';
        }
    });
}

// Logout Logic
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });
}
