document.getElementById('otpForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = localStorage.getItem('tempEmail');
    const otp_code = document.getElementById('otpCode').value;

    if (!email) {
        alert('Please register first.');
        window.location.href = 'register.html';
        return;
    }

    try {
        const res = await fetch('/api/auth/verify-telegram-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp_code })
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem('userEmail', email);
            window.location.href = 'welcome.html';
        } else {
            alert('❌ ' + data.message);
        }
    } catch (error) {
        alert('❌ Server error. Please try again.');
    }
});