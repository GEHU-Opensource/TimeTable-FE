const apiUrl = "http://127.0.0.1:8000/api/token/";

const loginForm = document.getElementById("admin-login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = usernameInput.value;
  const password = passwordInput.value;

  if (!username || !password) {
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
      errorMessage.textContent = data.detail || "Invalid credentials.";
    }
  } catch (error) {
    console.error("Error:", error);
    errorMessage.textContent = "An error occurred. Please try again later.";
  }
});
