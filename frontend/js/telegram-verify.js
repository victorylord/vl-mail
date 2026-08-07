document.getElementById('telegramForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = localStorage.getItem('tempEmail');
    const telegram_username = document.getElementById('telegramUsername').value;

    if (!email) {
        alert('Please register first.');
        window.location.href = 'register.html';
        return;
    }

    try {
        const res = await fetch('/api/auth/send-telegram-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, telegram_username })
        });

        const data = await res.json();

        if (data.success) {
            window.location.href = 'otp-verify.html';
        } else {
            alert('❌ ' + data.message);
        }
    } catch (error) {
        alert('❌ Failed to send code. Make sure your Telegram username is correct.');
    }
});