const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();
    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        const apiUrl = `http://172.16.30.194:8000/login/`;
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);
            if (data.teacher.teacher_type === "faculty") {
                window.location.href = "/faculty/profile.html";
            } else if (data.teacher.teacher_type === "hod") {
                window.location.href = "/faculty/hod.html";
            } else {
                window.location.href = "/admin/subject.html";
            }
        } else {
            // Alert for invalid credentials
            alert(data.detail || "Invalid credentials. Please try again.");
            errorMessage.textContent = data.detail || "Invalid credentials.";
        }
    } catch (error) {
        console.error("Error:", error);
        alert(
            "An error occurred while processing your request. Please try again later."
        );
        errorMessage.innerHTML = "An error occurred. Please try again later.";
    }
});

function togglePassword() {
    var showPass = document.getElementById("password");
    if (showPass.type === "password") {
        showPass.type = "text";
    }
    else {
        showPass.type = "password";
    }
}


// document.addEventListener("DOMContentLoaded", function () {
//   const loginForm = document.getElementById("login-form");

//   loginForm.addEventListener("submit", async function (event) {
//       event.preventDefault();

//       const email = document.getElementById("email").value.trim().toLowerCase();
//       const password = document.getElementById("password").value.trim();

//       if (!email || !password) {
//           alert("Please enter both email and password.");
//           return;
//       }

//       try {
//           const response = await fetch("http://127.0.0.1:8000/api/login/", {
//               method: "POST",
//               headers: {
//                   "Content-Type": "application/json"
//               },
//               body: JSON.stringify({ email, password })
//           });

//           const data = await response.json();

//           if (!response.ok) {
//               throw new Error(data.error || "Login failed");
//           }

//           // Store tokens in local storage
//           localStorage.setItem("access_token", data.access_token);
//           localStorage.setItem("refresh_token", data.refresh_token);
//           localStorage.setItem("teacher_type", data.teacher.teacher_type);

//           alert("Login successful!");

//           // Redirect based on teacher_type
//           if (data.teacher.teacher_type === "faculty") {
//               window.location.href = "/faculty_dashboard.html";
//           } else if (data.teacher.teacher_type === "hod") {
//               window.location.href = "/hod_dashboard.html";
//           } else {
//               window.location.href = "/default_dashboard.html";
//           }
//       } catch (error) {
//           alert(error.message);
//       }
//   });
// });