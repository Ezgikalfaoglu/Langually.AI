// chat.js - Chat Interface Logic (FR2, FR3, FR4)

document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    const mode = document.getElementById('learning-mode').value;

    if (!message) return;

    // UI: Add User Message
    addMessage(message, 'user');
    input.value = '';

    // API Call
    addTypingIndicator(); // FR19
    const res = await API.sendMessage(message, mode);
    removeTypingIndicator();

    if (res && res.response) {
        streamMessage(res.response); // FR19

        // Show corrections if any (FR4)
        if (res.corrections && res.corrections.length > 0) {
            const correctionHtml = res.corrections.map(c => `Example: ${c}`).join('<br>');
            setTimeout(() => addMessage(`💡 <b>Correction:</b><br>${correctionHtml}`, 'ai', true), 1000);
        }
    }
}

function addMessage(text, type, isHtml = false) {
    const chatBox = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.classList.add('message', type);
    if (isHtml) div.innerHTML = text; else div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addTypingIndicator() {
    const chatBox = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.id = 'typing-indicator';
    div.classList.add('message', 'ai', 'typing-indicator');
    div.innerHTML = '<span></span><span></span><span></span>';
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function streamMessage(text) {
    const chatBox = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.classList.add('message', 'ai');
    chatBox.appendChild(div);

    let i = 0;
    const interval = setInterval(() => {
        div.textContent += text.charAt(i);
        i++;
        chatBox.scrollTop = chatBox.scrollHeight;
        if (i >= text.length) clearInterval(interval);
    }, 20);
}
