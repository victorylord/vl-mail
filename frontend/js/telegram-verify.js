// frontend/js/telegram-verify.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('telegramForm');
    const email = localStorage.getItem('tempEmail');

    if (!email) {
        alert('Please register first.');
        window.location.href = 'register.html';
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const telegramUsername = document.getElementById('telegramUsername').value.trim();
        const button = this.querySelector('button[type="submit"]');

        if (!telegramUsername) {
            alert('⚠️ Please enter your Telegram username.');
            return;
        }

        button.disabled = true;
        button.textContent = 'Sending code...';

        try {
            const response = await fetch('/api/auth/send-telegram-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    telegram_username: telegramUsername
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('✅ Verification code sent to your Telegram!');
                window.location.href = 'otp-verify.html';
            } else {
                alert('❌ ' + data.message);
                button.disabled = false;
                button.textContent = 'Send Code →';
            }
        } catch (error) {
            console.error('Telegram OTP error:', error);
            alert('❌ Failed to send code. Make sure your Telegram username is correct.');
            button.disabled = false;
            button.textContent = 'Send Code →';
        }
    });
});