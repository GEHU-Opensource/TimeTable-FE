document.addEventListener("DOMContentLoaded", function () {
    const departmentDropdown = document.getElementById("department");
    /*
    fetch("api", {
        method: "GET",
    })
    .then(response => {
        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(departments => {
        if (Array.isArray(departments) && departments.length>0) {
            departments.forEach(department => {
                const option = document.createElement('option');
                option.value = department.name;
                option.textContent = department.name;
                departmentDropdown.appendChild(option);
            });
        }
        else {
            console.error("No departments found or invalid data format.");
        }
    })
    .catch(error => {
        console.log("Error: ",error);
        alert("System Failure");
    });*/

    if(typeof departments!=='undefined') {
        departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department.name;
            option.textContent = department.name;
            departmentDropdown.appendChild(option);
        });
    }
    else {
        console.error("Departments data is not defined.");
    }
});

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

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedSubjects = getSelectedSubjects();
    if(selectedSubjects.length === 0) {
        alert("Please select at least one preferred subject.");
        return;
    }

    const elements = getFormElementNames();
    const data = {
        name: elements[0].value.toUpperCase(),
        phone: elements[1].value,
        email: elements[2].value,
        department: elements[3].value,
        designation: elements[4].value,
        workingDays: elements[5].value,
        subjects: selectedSubjects, // Assuming `selectedSubjects` is an array
    };

    // Log the data to the console
    console.log("Data to be posted:", data);

    /*
    fetch("https://your-backend-endpoint.com/api/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify(data), // Convert the object to JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Data posted successfully:", data);
        alert("Data submitted successfully!");
    })
    .catch(error => {
        console.error("Error posting data:", error);
        alert("Failed to submit data. Please try again.");
    });
    */
    form.reset();
    selectedSubjectsContainer.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
    
    /*
    fetch("api", {
        method: "GET",
    })
    .then(response => {
        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse JSON from the response
    })
    .then(subjects => {
        subjects.forEach(subject => { // Loop through the array of subjects
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = subject;

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${subject}`));
            dropdownContent.appendChild(label);
        });
    })
    .catch(error => {
        console.error("Error: ", error);
        alert("System Failure");
    });*/
    loadSubjects();
});