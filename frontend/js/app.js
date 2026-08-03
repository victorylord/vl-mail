// frontend/js/app.js

// Email suggestions
const emailInput = document.getElementById('email');
const suggestionsBox = document.getElementById('emailSuggestions');
const emailStatus = document.getElementById('emailStatus');

const existingEmails = [
    'victory@vlmail.com', 'john@vlmail.com', 'jane@vlmail.com',
    'developer@vlmail.com', 'support@vlmail.com', 'admin@vlmail.com',
    'test@vlmail.com', 'info@vlmail.com', 'contact@vlmail.com'
];

if (emailInput) {
    emailInput.addEventListener('input', function() {
        const typed = this.value.trim().toLowerCase();
        const domain = '@vlmail.com';

        if (typed && !typed.includes('@')) {
            const suggestions = existingEmails.filter(email => 
                email.toLowerCase().startsWith(typed + domain) ||
                email.toLowerCase().startsWith(typed)
            );
            const typedWithDomain = typed + domain;
            if (!existingEmails.includes(typedWithDomain) && typed.length >= 2) {
                suggestions.unshift(typedWithDomain);
            }
            if (suggestions.length > 0 && suggestions.length < 10) {
                suggestionsBox.innerHTML = suggestions.map(s => 
                    `<div class="suggestion-item" data-email="${s}">${s}</div>`
                ).join('');
                suggestionsBox.style.display = 'block';
                emailStatus.textContent = '';
            } else if (suggestions.length >= 10) {
                suggestionsBox.innerHTML = `<div class="suggestion-item">Too many results. Keep typing.</div>`;
                suggestionsBox.style.display = 'block';
            } else {
                suggestionsBox.style.display = 'none';
                emailStatus.textContent = '✓ Available';
                emailStatus.style.color = '#4ade80';
            }
        } else {
            suggestionsBox.style.display = 'none';
            if (typed) {
                const exists = existingEmails.includes(typed);
                if (exists) {
                    emailStatus.textContent = '⚠️ This email is already taken';
                    emailStatus.style.color = '#f87171';
                    suggestionsBox.innerHTML = existingEmails
                        .filter(e => e.includes(typed.split('@')[0]))
                        .map(e => `<div class="suggestion-item" data-email="${e}">Try: ${e}</div>`)
                        .join('');
                    suggestionsBox.style.display = 'block';
                } else {
                    emailStatus.textContent = '✅ Available';
                    emailStatus.style.color = '#4ade80';
                    suggestionsBox.style.display = 'none';
                }
            }
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('suggestion-item')) {
            emailInput.value = e.target.dataset.email;
            suggestionsBox.style.display = 'none';
            emailStatus.textContent = '✅ Selected';
            emailStatus.style.color = '#4ade80';
        }
    });
}

// Terms checkbox toggle
const termsCheck = document.getElementById('termsCheck');
const registerBtn = document.getElementById('registerBtn');
if (termsCheck && registerBtn) {
    termsCheck.addEventListener('change', function() {
        registerBtn.disabled = !this.checked;
        registerBtn.style.opacity = this.checked ? '1' : '0.6';
        registerBtn.style.cursor = this.checked ? 'pointer' : 'not-allowed';
    });
}

// Registration form submission
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;

        if (!document.getElementById('termsCheck').checked) {
            alert('Please agree to the Terms & Conditions.');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: fullName,
                    email: email,
                    phone_number: phone,
                    password: password
                })
            });
            const data = await response.json();
            if (data.success) {
                alert('✅ Registration successful! Please verify your phone.');
                window.location.href = '/login.html';
            } else {
                alert('❌ ' + data.message);
            }
        } catch (error) {
            alert('❌ Server error. Please try again.');
        }
    });
}

// Login form submission (basic)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('🔐 Login functionality coming soon! (Backend endpoint needed)');
    });
}

// Countdown Timer
function startCountdown() {
    const launchDate = new Date('2026-09-01T00:00:00').getTime(); // Set your launch date

    const timer = setInterval(function() {
        const now = new Date().getTime();
        const distance = launchDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        if (distance < 0) {
            clearInterval(timer);
            document.querySelector('.countdown h3').textContent = '🎉 VL Mail is LIVE!';
        }
    }, 1000);
}

startCountdown();