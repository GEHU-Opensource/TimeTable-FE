document.addEventListener("DOMContentLoaded", function () {
  const uploadForm = document.getElementById("uploadForm");
  const csvInput = document.getElementById("csvFiles");
  const responseDiv = document.getElementById("response");
  const baseUrl = BE_URL;
  const logoutBtn = document.querySelector(".logout-btn");
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../login.html";
  });

  uploadForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (csvInput.files.length <= 1) {
      showMessage("Please select at least two CSV files.", "error");
      return;
    }
    if (csvInput.files.length === 0) {
      showMessage("Please select at least one CSV file.", "error");
      return;
    }

    const formData = new FormData();
    for (const file of csvInput.files) {
      formData.append("csv_files", file);
    }

    try {
      showMessage("Processing... Please wait.", "info");

      const response = await fetch(`${baseUrl}/detectConflicts/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      responseDiv.style.display = "block";
      responseDiv.innerHTML = "";

      if (response.ok) {
        if (data.conflicts && data.conflicts.length > 0) {
          displayConflicts(data.conflicts);
        } else if (data.message) {
          showMessage(data.message, "success");
        }
      } else {
        showMessage(
          data.error || "An error occurred while processing.",
          "error"
        );
      }
    } catch (error) {
      showMessage("Network error. Please try again.", "error");
    }
  });

  function showMessage(message, type) {
    responseDiv.innerHTML = `<p class="${type}">${message}</p>`;
    responseDiv.style.display = "block";
  }

    function displayConflicts(conflicts) {
        responseDiv.innerHTML = "<h3>Conflicts Found</h3>";
        conflicts.forEach((conflict, index) => {
            const conflictEntry = document.createElement("div");
            conflictEntry.classList.add("conflict-entry");

            // Ensure conflict.details is formatted correctly
            const conflictMessage = conflict.conflict_details
                ? JSON.stringify(conflict.conflict_details, null, 2) // Convert the conflict details object to a string
                : conflict.message || "Details not provided";

            conflictEntry.innerHTML = `
                  <pre><strong>Conflict Details:</strong> ${conflictMessage}</pre>
                  <hr>
              `;
            responseDiv.appendChild(conflictEntry);
        });
        responseDiv.style.display = "block";
    }
});
