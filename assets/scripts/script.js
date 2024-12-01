const apiUrl = `${BE_URL}/api/token/`;

const loginForm = document.getElementById("admin-login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Please fill out all fields."); // Alert for empty fields
    errorMessage.textContent = "Please fill out all fields.";
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      const expirationTime = Date.now() + 2 * 60 * 60 * 1000;
      localStorage.setItem("sessionExpiresAt", expirationTime);

      // Redirect to a different page upon successful login
      window.location.href = "../admin/subject.html";
    } else {
      // Alert for invalid credentials
      alert(data.detail || "Invalid credentials. Please try again.");
      errorMessage.textContent = data.detail || "Invalid credentials.";
    }
  } catch (error) {
    console.error("Error:", error);
    alert(
      "An error occurred while processing your request. Please try again later."
    ); // Alert for server/network errors
    errorMessage.textContent = "An error occurred. Please try again later.";
  }
});

function togglePassword() {
  var showPass = document.getElementById("password");
  if(showPass.type==="password") {
    showPass.type = "text";
  }
  else {
    showPass.type = "password";
  }
}