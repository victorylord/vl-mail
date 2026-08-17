// frontend/js/register.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const termsCheck = document.getElementById('termsCheck');
    const registerBtn = document.getElementById('registerBtn');

    // Enable/disable button based on terms checkbox
    termsCheck.addEventListener('change', function() {
        registerBtn.disabled = !this.checked;
        registerBtn.style.opacity = this.checked ? '1' : '0.6';
        registerBtn.style.cursor = this.checked ? 'pointer' : 'not-allowed';
    });

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!fullName || !email || !password) {
            alert('⚠️ Please fill in all fields.');
            return;
        }

        if (!termsCheck.checked) {
            alert('⚠️ Please agree to the Terms of Service.');
            return;
        }

        // Disable button to prevent double submission
        registerBtn.disabled = true;
        registerBtn.textContent = 'Creating account...';

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: fullName,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('tempEmail', email);
                alert('✅ Account created! Please verify your Telegram.');
                window.location.href = 'telegram-verify.html';
            } else {
                alert('❌ ' + data.message);
                registerBtn.disabled = false;
                registerBtn.textContent = 'Create Account';
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('❌ Server error. Please try again.');
            registerBtn.disabled = false;
            registerBtn.textContent = 'Create Account';
        }
    });
});