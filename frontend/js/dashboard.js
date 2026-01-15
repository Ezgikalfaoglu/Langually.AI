// dashboard.js - Dashboard Logic (FR8, FR9)

document.addEventListener('DOMContentLoaded', async () => {
    loadStats();
    loadActivityTimeline();
});

async function loadStats() {
    const data = await API.getProgress();
    if (data) {
        document.getElementById('streak-val').innerText = `${data.streak} Days`;
        document.getElementById('xp-val').innerText = data.xp;
    }
}

async function loadActivityTimeline() {
    const data = await API.getHistory(); // { logs: [...] }
    const container = document.getElementById('timeline-feed');

    if (!data || !data.logs || data.logs.length === 0) {
        container.innerHTML = '<p style="color:var(--text-secondary); padding-left:1rem;">No recent activity.</p>';
        return;
    }

    let html = '';
    // Show last 4 activities
    data.logs.slice(-4).reverse().forEach(log => {
        let icon = 'chatbubbles';
        let title = 'Chat Session';

        if (log.mode === 'quiz') { icon = 'school'; title = 'Completed Quiz'; }
        else if (log.mode === 'explanation') { icon = 'book'; title = 'Studied Explanation'; }
        else if (log.type === 'writing') { icon = 'pencil'; title = 'Writing Assignment'; }

        html += `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h4>${title}</h4>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.2rem;">${log.message.substring(0, 40)}...</p>
                    <div class="timeline-date">${new Date(log.date).toLocaleString()}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}
