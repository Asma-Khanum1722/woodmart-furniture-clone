document.addEventListener('DOMContentLoaded', () => {
    // Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));

            // Add active class
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            const targetForm = tabId === 'login' ? document.getElementById('login-form') : document.getElementById('register-form');
            if (targetForm) targetForm.classList.add('active');
        });
    });

    // Register Logic
    const registerForm = document.getElementById('form-register');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const errorMsg = document.getElementById('reg-error');

            if (!name || !email || !password) {
                errorMsg.innerText = 'Please fill all fields.';
                return;
            }

            // Get existing users
            const users = JSON.parse(localStorage.getItem('woodmartUsers')) || [];

            // Check if email exists
            if (users.some(user => user.email === email)) {
                errorMsg.innerText = 'Email already registered.';
                return;
            }

            // Save new user
            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('woodmartUsers', JSON.stringify(users));

            // Log them in immediately
            localStorage.setItem('woodmartCurrentUser', JSON.stringify(newUser));

            errorMsg.style.color = 'green';
            errorMsg.innerText = 'Account created! Redirecting...';

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }

    // Login Logic
    const loginForm = document.getElementById('form-login');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorMsg = document.getElementById('login-error');

            const users = JSON.parse(localStorage.getItem('woodmartUsers')) || [];

            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Success
                localStorage.setItem('woodmartCurrentUser', JSON.stringify(user));
                errorMsg.style.color = 'green';
                errorMsg.innerText = 'Login successful! Redirecting...';

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                // Fail
                errorMsg.style.color = '#e74c3c';
                errorMsg.innerText = 'Invalid email or password.';
            }
        });
    }
});
