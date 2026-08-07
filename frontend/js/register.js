document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const full_name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!document.getElementById('termsCheck').checked) {
        alert('Please agree to the Terms of Service.');
        return;
    }

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name, email, password })
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem('tempEmail', email);
            window.location.href = 'telegram-verify.html';
        } else {
            alert('❌ ' + data.message);
        }
    } catch (error) {
        alert('❌ Server error. Please try again.');
    }
});