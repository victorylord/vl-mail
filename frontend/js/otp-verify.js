// frontend/js/otp-verify.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('otpForm');
    const email = localStorage.getItem('tempEmail');

    if (!email) {
        alert('Please register first.');
        window.location.href = 'register.html';
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const otpCode = document.getElementById('otpCode').value.trim();
        const button = this.querySelector('button[type="submit"]');

        if (!otpCode || otpCode.length !== 6) {
            alert('⚠️ Please enter a valid 6-digit code.');
            return;
        }

        button.disabled = true;
        button.textContent = 'Verifying...';

        try {
            const response = await fetch('/api/auth/verify-telegram-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    otp_code: otpCode
                })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('userEmail', email);
                alert('🎉 Account verified successfully!');
                window.location.href = 'welcome.html';
            } else {
                alert('❌ ' + data.message);
                button.disabled = false;
                button.textContent = 'Verify →';
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            alert('❌ Server error. Please try again.');
            button.disabled = false;
            button.textContent = 'Verify →';
        }
    });
});