document.getElementById('admin-login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    // Hardcoded credentials for demonstration
    const adminUsername = 'admin123';
    const adminPassword = 'Admin@123';

    if (username === adminUsername && password === adminPassword) {
        alert('Login successful! Redirecting to admin dashboard...');
        // Simulate redirecting to another page
        window.location.href = 'subject.html'; 
    } else {
        errorMessage.textContent = 'Invalid username or password.';
        errorMessage.style.display = 'block';
    }
});
