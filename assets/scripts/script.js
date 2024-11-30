const form = document.getElementById('admin-login-form');
const usernameField = document.getElementById('username');
const passwordField = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = usernameField.value;
    const password = passwordField.value;

    if (!username || !password) {
        errorMessage.textContent = "Username and password are required!";
        return;
    }

    try {
        const response = await fetch('https://reqres.in/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: username,
                password: password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('access', data.token);
            const expirationTime = Date.now() + 3600000;
            localStorage.setItem('sessionExpiresAt', expirationTime);
            window.location.href = '../admin/subject.html';
        } else {
            errorMessage.textContent = data.error || "Login failed. Please try again.";
        }
    } catch (error) {
        errorMessage.textContent = "An error occurred. Please try again later.";
    }
});