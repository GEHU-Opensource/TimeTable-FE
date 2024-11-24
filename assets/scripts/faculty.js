const form = document.getElementById("facultyForm");
const searchInput = document.getElementById("searchSubjects");
const dropdown = document.querySelector(".dropdown-content");
const checkboxes = document.querySelectorAll(".dropdown-content input[type='checkbox']");
const selectedSubjectsContainer = document.querySelector(".selected-subjects");
const subjectList = document.getElementById("subjectList");

function getFormElementNames() {
    const elements = form.elements;
    const elementDetails = [];
    for(let i=0; i<elements.length; i++) {
        const element = elements[i];
        if(element.name) {
            elementDetails.push({
                name: element.name || "No Name",
                value: element.value || ""
            });
        }
    }
    return elementDetails;
}

function getSelectedSubjects() {
    const selectedSubjects = [];
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

document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const selectedSubjects = getSelectedSubjects();
        if(selectedSubjects.length === 0) {
            alert("Please select at least one preferred subject.");
            return;
        }

        const elements = getFormElementNames();
        const data = {
            name: elements[0].value,
            phone: elements[1].value,
            email: elements[2].value,
            department: elements[3].value,
            designation: elements[4].value,
            working_days: elements[5].value,
            subjects: selectedSubjects,
        };

        console.log(data);
        document.getElementById('facultyForm').reset();selectedSubjectsContainer.style.display = "none";
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", updateSelectedSubjects);
    });
});

searchInput.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const labels = document.querySelectorAll(".dropdown-content label");
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
    dropdown.style.display = hasVisibleOption ? "block" : "none";
});

document.addEventListener("click", function (event) {
    if(!searchInput.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = "none";
    }
});

searchInput.addEventListener("focus", function () {
    dropdown.style.display = "block";
});