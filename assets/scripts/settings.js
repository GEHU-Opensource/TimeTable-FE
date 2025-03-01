document.addEventListener("DOMContentLoaded", ()=> {
    const baseUrl = BE_URL;

    logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "../index.html";
    });

    document.getElementById("show-password").addEventListener("click", function () {
        var passwordFields = document.querySelectorAll(".password");
        passwordFields.forEach(function(field) {
            if (field.type === "password") {
                field.type = "text";
            }
            else {
                field.type = "password";
            }
        });
    });

    document.getElementById("update-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const oldPasswordInput = document.getElementById("oldPass");
        const newPasswordInput = document.getElementById("newPass");
        const confirmPasswordInput = document.getElementById("confirmPass");
        const data = {
            old_password : oldPasswordInput.value.trim(),
            new_password : newPasswordInput.value.trim(),
            confirm_password : confirmPasswordInput.value.trim(),
        }
        const token = localStorage.getItem("access_token");
        fetch(`${baseUrl}/updatePassword/`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(handleResponse)
            .then((response) => {
                alert(response.message);
                document.location.reload();
            })
            .catch(showError);
    });

    function handleResponse(response) {
        return response.json().then((data) => {
            if (!response.ok) {
                throw new Error(data.error || data.message || `HTTP error! Status: ${response.status}`);
            }
            return data;
        });
    }    

    function showError(error) {
        console.error("Error: ", error);
        const errorMessage = error.message || "An error occurred.";
    
        if (errorMessage.includes("401")) {
            alert("Session expired. Redirecting to login...");
            window.location.href = "../index.html";
        } else {
            alert(errorMessage);
        }
    }
});