const form = document.getElementById("facultyForm");
const searchInput = document.getElementById("searchSubjects");
const dropdownContent = document.querySelector(".dropdown-content");
const selectedSubjectsContainer = document.querySelector(".selected-subjects");
const subjectList = document.getElementById("subjectList");

function loadSubjects() {
    dropdownContent.innerHTML = "";
    subjects.forEach(subject => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = subject;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${subject}`));
        dropdownContent.appendChild(label);
    });
    const checkboxes = dropdownContent.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", updateSelectedSubjects);
    });
}

function getSelectedSubjects() {
    const selectedSubjects = [];
    const checkboxes = dropdownContent.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        if(checkbox.checked) {
            selectedSubjects.push(checkbox.value);
        }
    });
    return selectedSubjects;
}

function updateSelectedSubjects() {
    const selectedSubjects = getSelectedSubjects();
    subjectList.innerHTML = "";
    if(selectedSubjects.length > 0) {
        selectedSubjects.forEach(subject => {
            const subjectElement = document.createElement("span");
            subjectElement.textContent = subject;
            subjectList.appendChild(subjectElement);
        });
        selectedSubjectsContainer.style.display = "block";
    }
    else {
        selectedSubjectsContainer.style.display = "none";
    }
}

searchInput.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const labels = dropdownContent.querySelectorAll("label");
    let hasVisibleOption = false;

    labels.forEach(label => {
        const text = label.textContent.toLowerCase();
        if(text.includes(searchValue)) {
            label.style.display = "flex";
            hasVisibleOption = true;
        }
        else {
            label.style.display = "none";
        }
    });
    dropdownContent.style.display = hasVisibleOption ? "block" : "none";
});

document.addEventListener("click", function (event) {
    if(!searchInput.contains(event.target) && !dropdownContent.contains(event.target)) {
        dropdownContent.style.display = "none";
    }
});

searchInput.addEventListener("focus", function () {
    dropdownContent.style.display = "block";
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedSubjects = getSelectedSubjects();
    if(selectedSubjects.length === 0) {
        alert("Please select at least one preferred subject.");
        return;
    }

    const formData = new FormData(form);
    const data = {
        name: formData.get("name").toUpperCase(),
        phone: formData.get("number"),
        email: formData.get("email"),
        department: formData.get("department"),
        designation: formData.get("designation"),
        working_days: formData.get("workingDays"),
        subjects: selectedSubjects,
    };

    console.log(data);
    form.reset();
    selectedSubjectsContainer.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
    loadSubjects();
});