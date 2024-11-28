document.getElementById('admin-login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');
    sessionStorage.setItem("isLoggedin","false");
    // Hardcoded credentials for demonstration
    const adminUsername = 'admin123';
    const adminPassword = 'Admin@123';
    sessionStorage.setItem("isLoggedin","false");
    if (username === adminUsername && password === adminPassword) {
        sessionStorage.setItem("isLoggedin","true");
        alert('Login successful!');
        window.location.href = 'subject.html'; 
        username.value = "";
        password.textContent = "";
    } else {
        errorMessage.textContent = 'Invalid username or password.';
        errorMessage.style.display = 'block';
    }
});
