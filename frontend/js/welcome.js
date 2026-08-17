// frontend/js/welcome.js

document.addEventListener('DOMContentLoaded', function() {
    const email = localStorage.getItem('userEmail');

    if (email) {
        document.getElementById('userEmail').textContent = email;
    } else {
        // If no email, redirect to register
        window.location.href = 'register.html';
    }
});