const departmentDropdown = document.getElementById("department");
const form = document.getElementById("facultyForm");
const searchInput = document.getElementById("searchSubjects");
const dropdownContent = document.querySelector(".dropdown-content");
const selectedSubjectsContainer = document.querySelector(".selected-subjects");
const subjectList = document.getElementById("subjectList");
const baseUrl = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
  loadDepartments();
  loadSubjects();
  setupSearchInput();
  setupFormSubmission();
});

function loadDepartments() {
  if (typeof departments !== "undefined") {
    departments.forEach((department) => {
      const option = document.createElement("option");
      option.value = department.name;
      option.textContent = department.name;
      departmentDropdown.appendChild(option);
    });
  } else {
    console.error("Departments data is not defined.");
  }
}

function loadSubjects() {
  dropdownContent.innerHTML = "";

  fetch(`${baseUrl}/getAllSubjects/`, { method: "GET" })
    .then(handleResponse)
    .then((subjects) => {
      subjects.forEach((subject) => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = subject.subject_name;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${subject.subject_name}`));
        dropdownContent.appendChild(label);

        checkbox.addEventListener("change", updateSelectedSubjects);
      });
    })
    .catch(showError);
}

function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

function showError(error) {
  console.error("Error: ", error);
  alert(error);
}

function updateSelectedSubjects() {
  const selectedSubjects = getSelectedSubjects();
  subjectList.innerHTML = "";
  if (selectedSubjects.length > 0) {
    selectedSubjects.forEach((subject) => {
      const subjectElement = document.createElement("span");
      subjectElement.textContent = subject;
      subjectList.appendChild(subjectElement);
    });
    selectedSubjectsContainer.style.display = "block";
  } else {
    selectedSubjectsContainer.style.display = "none";
  }
}

function getSelectedSubjects() {
  const selectedSubjects = [];
  const checkboxes = dropdownContent.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedSubjects.push(checkbox.value);
    }
  });
  return selectedSubjects;
}

function setupSearchInput() {
  searchInput.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const labels = dropdownContent.querySelectorAll("label");
    let hasVisibleOption = false;

    labels.forEach((label) => {
      const text = label.textContent.toLowerCase();
      label.style.display = text.includes(searchValue) ? "flex" : "none";
      if (text.includes(searchValue)) hasVisibleOption = true;
    });

    dropdownContent.style.display = hasVisibleOption ? "block" : "none";
  });

  searchInput.addEventListener("focus", function () {
    dropdownContent.style.display = "block";
  });

  document.addEventListener("click", function (event) {
    if (
      !searchInput.contains(event.target) &&
      !dropdownContent.contains(event.target)
    ) {
      dropdownContent.style.display = "none";
    }
  });
}

function setupFormSubmission() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedSubjects = getSelectedSubjects();
    if (selectedSubjects.length === 0) {
      alert("Please select at least one preferred subject.");
      return;
    }

    const formData = gatherFormData(selectedSubjects);

    submitFormData(formData);
  });
}

function gatherFormData(selectedSubjects) {
  const elements = form.elements;
  const data = {
    name: elements["name"].value,
    phone: elements["phone"].value,
    email: elements["email"].value,
    department: elements["department"].value,
    designation: elements["designation"].value,
    working_days: elements["working_days"].value,
    preferred_subjects: selectedSubjects,
  };
  return data;
}

function submitFormData(data) {
  // Show loading indicator
  document.getElementById("loading-spinner").style.display = "block";

  fetch(`${baseUrl}/addTeacher/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(
            errorData.error || `HTTP error! Status: ${response.status}`
          );
        });
      }
      return response.json();
    })
    .then((responseData) => {
      // Hide the loading spinner
      document.getElementById("loading-spinner").style.display = "none";

      // Handle success
      if (responseData.message) {
        alert(responseData.message); // Show success message from backend
      }

      // Reset form fields and hide selected subjects container
      form.reset();
      selectedSubjectsContainer.style.display = "none";
    })
    .catch((error) => {
      // Hide the loading spinner in case of an error
      document.getElementById("loading-spinner").style.display = "none";

      // Display error messages from response
      if (error.message.includes("Teacher with this email already exists.")) {
        alert("This teacher's email already exists. Please try again.");
      } else {
        alert("Failed to submit data. Please try again.");
      }

      console.error("Error posting data:", error);
    });
}
