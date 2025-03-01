document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const departmentDropdown = document.getElementById("department");
    const profileForm = document.getElementById("profileForm");
    const searchInput = document.getElementById("searchSubjects");
    const dropdownContent = document.querySelector(".dropdown-content");
    const selectedSubjectsContainer = document.querySelector(".selected-subjects");
    const subjectList = document.getElementById("subjectList");
    const editButton = document.getElementById("editBtn");
    const submitBtn = document.getElementById("submitBtn");
    const profileHead = document.getElementById("profileHeading");
    const baseUrl = BE_URL;
    let originalData = {};

    logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "../index.html";
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

    function getTeachersData() {
        const token = localStorage.getItem("access_token");
        fetch(`${baseUrl}/getSpecificTeacher/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then(handleResponse)
        .then(data => {
            originalData = { ...data };
            if(originalData.assigned_subjects.length===0) {
                document.querySelector(".inRequest").style.display = "block";
            }
            else {
                document.querySelector(".inRequest").style.display = "none";
            }
            populateProfileForm(data);
            loadDepartments(data.department);
            loadSubjects(data.assigned_subjects || []);
            const teacherCode = data.teacher_code;
            profileHead.textContent = `Profile ( ${teacherCode} )`;
        })
        .catch(showError);
    }

    function populateProfileForm(data) {

        profileForm.elements["name"].value = data.name || "";
        profileForm.elements["phone"].value = data.phone || "";
        profileForm.elements["email"].value = data.email || "";
        profileForm.elements["designation"].value = data.designation || "";
        profileForm.elements["working_days"].value = data.working_days || "";
    }

    function toggleEditMode(enable) {
        const inputs = profileForm.querySelectorAll("input, select");
        inputs.forEach(input => {
            if (!["email", "name"].includes(input.id)) {
                input.disabled = !enable;
            }
        });
        submitBtn.disabled = !enable;
        editButton.querySelector("i").classList.toggle("fa-pencil", !enable);
        editButton.querySelector("i").classList.toggle("fa-times", enable);
    }

    editButton.addEventListener("click", () => {
        const isEditing = !profileForm.elements["department"].disabled;

        if (isEditing) {
            if (confirm("You have unsaved changes. Discard them?")) {
                populateProfileForm(originalData);
                loadDepartments(originalData.department);
                loadSubjects(originalData.assigned_subjects || []);
                toggleEditMode(false);
            } else {
                toggleEditMode(false);
            }
        } else {
            toggleEditMode(true);
        }
    });

    profileForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const selectedSubjects = getSelectedSubjects();
        if (selectedSubjects.length === 0) {
            alert("Please select at least one preferred subject.");
            return ;
        }
        const updatedData = {
            id: originalData.id,
            teacher_code: originalData.teacher_code,
            teacher_type: originalData.teacher_type,
            name: profileForm.elements["name"].value,
            phone: profileForm.elements["phone"].value,
            email: profileForm.elements["email"].value,
            department: profileForm.elements["department"].value,
            designation: profileForm.elements["designation"].value,
            working_days: profileForm.elements["working_days"].value,
            assigned_subjects: selectedSubjects,
        };
        if(confirm("Are you sure to Submit these details?"))
            submitData(updatedData);
    });

    function submitData(updatedData) {
        const token = localStorage.getItem("access_token");
        fetch(`${baseUrl}/updateTeacher/${originalData.id}/`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        })
        .then(handleResponse)
        .then(() => {
            alert("Profile updated successfully!");
            originalData = { ...updatedData };
            document.location.reload();
        })
        .catch(showError);
    }

    function loadDepartments(selectedDepartment) {
        departmentDropdown.innerHTML = "";
        if (Array.isArray(departments)) {
            departments.forEach(department => {
                const option = document.createElement("option");
                option.value = department.name;
                option.textContent = department.name;
                if (department.name === selectedDepartment) option.selected = true;
                departmentDropdown.appendChild(option);
            });
        }
    }

    function loadSubjects(preferredSubjects) {
        dropdownContent.innerHTML = ""; // Clear previous content
    
        fetch(`${baseUrl}/getAllSubjects/`, { method: "GET" })
            .then(handleResponse)
            .then((subjects) => {
                if (!Array.isArray(subjects) || subjects.length === 0) {
                    dropdownContent.innerHTML = "<label>No subjects available</label>";
                    return;
                }
    
                subjects.forEach((subject) => {
                    const label = document.createElement("label");
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.value = subject.subject_name;
                    checkbox.checked = preferredSubjects.includes(subject.subject_name);
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(` ${subject.subject_name}`));
                    dropdownContent.appendChild(label);
    
                    checkbox.addEventListener("change", updateSelectedSubjects);
                });
    
                updateSelectedSubjects(); // Ensure selected subjects are updated
            })
            .catch(showError);
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
        }
        else {
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

    getTeachersData();
    setupSearchInput();
});
