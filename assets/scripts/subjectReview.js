document.addEventListener("DOMContentLoaded", function () {
    showTab("pending");
});

const baseUrl = BE_URL;
const searchBar = document.querySelector(".searchBar");
let requests = {};
let approved = {};

logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../index.html";
});

function showTab(tabId) {
    toggleActiveClass(tabId);
    tabId === "pending" ? getPendingRequests() : getApprovedSubjects();
}

function toggleActiveClass(tabId) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(button => button.classList.remove("active"));
    document.getElementById(tabId).classList.add("active");
    document.querySelector(`button[onclick="showTab('${tabId}')"]`).classList.add("active");
}

function getPendingRequests() {
    const token = localStorage.getItem("access_token");
    fetch(`${baseUrl}/getPendingRequests/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then(handleResponse)
        .then(data => {
            if (Object.keys(data.pending_requests).length === 0) {
                document.querySelector(".request-container").innerHTML = `<p class="emptyRequests">No subject is pending for approval.</p>`;
                return;
            }
            searchBar.style.display = "flex";
            requests = {...data};
            loadPendingSubjects(requests);
        })
        .catch(showError);
}

function loadPendingSubjects(requests) {
    const requestContainer = document.querySelector(".request-container");
    requestContainer.innerHTML = "";
    requests.subjects.forEach(({ subject_name, subject_code }) => {
        populateSubjectCard(subject_name, subject_code, requests);
    });

    // Add Approve button centered at the bottom
    createApproveButton(requests);
}

function createApproveButton(requests) {
    const submitSection = document.createElement("div");
    submitSection.classList.add("submitBtn");
    submitSection.innerHTML = `<button type="submit" id="approveBtn">Approve</button>`;
    document.getElementById("approveButton").innerHTML = "";
    document.getElementById("approveButton").appendChild(submitSection);
    document.getElementById("approveBtn").addEventListener("click", () => {
        const selectedTeachersMap = getSelectedTeachersMap(requests);
        if (!isValidTeachersSelection(selectedTeachersMap)) {
            alert(`Please select at least one Teacher for each Subject!`);
            return;
        }
        submitApproval(selectedTeachersMap);
    });
}

function isValidTeachersSelection(selectedTeachersMap) {
    return Object.values(selectedTeachersMap).every(teachers => teachers.length > 0);
}

function getSelectedTeachersMap(requests) {
    const selectedTeachersMap = {};
    document.querySelectorAll(".subject-container").forEach(subjectDiv => {
        const subjectCode = subjectDiv.querySelector(".subject").textContent.match(/\((.*?)\)/)[1];
        const selectedTeachers = [];

        subjectDiv.querySelectorAll(".selected-teachers .selected-teacher").forEach(span => {
            const teacherNameAndCode = span.textContent;
            let teacherCode = null;
            // Extract teacher code if it contains "("
            if (teacherNameAndCode.includes("(")) {
                teacherCode = teacherNameAndCode.substring(
                    teacherNameAndCode.indexOf('(') + 1, 
                    teacherNameAndCode.indexOf(')')
                );
            } else {
                teacherCode = teacherNameAndCode; // If no parentheses, keep original text
            }
            const teacherData = requests.teachers.find(t => t.teacher_code === teacherCode);
            
            if (teacherData) selectedTeachers.push(teacherData.teacher_code)
            else selectedTeachers.push(teacherCode);
        });

        selectedTeachersMap[subjectCode] = selectedTeachers;
    });

    return selectedTeachersMap;
}

const searchSubject = document.getElementById("pendingSubjectSearch");
searchSubject.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const filteredSubjects = requests.subjects.filter(({ subject_name, subject_code }) => 
        subject_name.toLowerCase().includes(searchValue) || subject_code.toLowerCase().includes(searchValue)
    );

    // Clear the existing subjects
    document.querySelector(".request-container").innerHTML = "";

    // Populate the filtered subjects
    filteredSubjects.forEach(({ subject_name, subject_code }) => {
        populateSubjectCard(subject_name, subject_code, requests);
    });
});

function populateSubjectCard(subject_name, subject_code, requests) {
    const subjectDiv = createSubjectCard(subject_name, subject_code, requests);
    document.querySelector(".request-container").appendChild(subjectDiv);
}

function createSubjectCard(subject_name, subject_code, requests) {
    const subjectDiv = document.createElement("div");
    subjectDiv.classList.add("subject-container");

    const teachersLabel = requests.pending_requests[subject_code] || [];
    const assignedTeachers = teachersLabel.map(obj => { 
        const teacherCode = Object.keys(obj)[0]; // Extract teacher code
        const teacherName = obj[teacherCode]; // Extract teacher name
        return `${teacherName} (${teacherCode})`;
    }).filter(Boolean);
    subjectDiv.innerHTML = `
        <label class="subject">${subject_name}<br>(${subject_code})</label>
        <div class="teacher-selection">
            <input type="text" class="teacher-search" placeholder="Search and select teachers">
            <div class="dropdown-content"></div>
        </div>
        <label>Selected Teachers</label>
        <div class="selected-teachers"></div>
    `;

    const searchInput = subjectDiv.querySelector(".teacher-search");
    const dropdown = subjectDiv.querySelector(".dropdown-content");
    const selectedTeachersDiv = subjectDiv.querySelector(".selected-teachers");

    populateDropdown(assignedTeachers, requests, dropdown);
    populateSelectedTeachers(assignedTeachers, selectedTeachersDiv);

    attachDropdownListeners(searchInput, dropdown, selectedTeachersDiv);

    return subjectDiv;
}

function populateDropdown(assignedTeachers, requests, dropdown) {
    const allTeachers = requests.teachers.map(t => t.teacher_name+" ("+t.teacher_code+")");
    assignedTeachers.forEach(teacher => dropdown.appendChild(createTeacherCheckbox(teacher, true)));
    allTeachers.filter(t => !assignedTeachers.includes(t)).forEach(teacher_code => dropdown.appendChild(createTeacherCheckbox(teacher_code, false)));
}

function createTeacherCheckbox(teacher, checked) {
    const label = document.createElement("label");
    label.innerHTML = `
        <input type="checkbox" value="${teacher}" ${checked ? "checked" : ""}>
        ${teacher}
    `;
    return label;
}

function populateSelectedTeachers(assignedTeachers, selectedTeachersDiv) {
    assignedTeachers.forEach(teacher => {
        const teacherTag = document.createElement("span");
        teacherTag.textContent = teacher;
        teacherTag.classList.add("selected-teacher");
        selectedTeachersDiv.appendChild(teacherTag);
    });
}

function attachDropdownListeners(searchInput, dropdown, selectedTeachersDiv) {
    searchInput.addEventListener("click", () => {
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });

    dropdown.addEventListener("change", (event) => {
        const checkbox = event.target;
        if (checkbox.checked) {
            const teacherTag = document.createElement("span");
            teacherTag.textContent = checkbox.value;
            teacherTag.classList.add("selected-teacher");
            selectedTeachersDiv.appendChild(teacherTag);
        } else {
            Array.from(selectedTeachersDiv.children).forEach(span => {
                if (span.textContent === checkbox.value) {
                    span.remove();
                }
            });
        }
    });

    searchInput.addEventListener("input", function () {
        const searchValue = this.value.toLowerCase();
        const labels = dropdown.querySelectorAll("label");
        let hasVisibleOption = false;

        labels.forEach((label) => {
            const text = label.textContent.toLowerCase();
            label.style.display = text.includes(searchValue) ? "flex" : "none";
            if (text.includes(searchValue)) hasVisibleOption = true;
        });

        dropdown.style.display = hasVisibleOption ? "block" : "none";
    });

    document.addEventListener("click", function (event) {
        if (!searchInput.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = "none";
        }
    });
}

function submitApproval(selectedTeachersMap) {
    const token = localStorage.getItem("access_token");
    fetch(`${baseUrl}/approveSubjectRequests/`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedTeachersMap),
    })
    .then(handleResponse)
    .then(() => {
        alert("Subjects approved successfully!");
        document.location.reload();
    })
    .catch(error => {
        console.error("Error approving subjects:", error);
        alert("Failed to approve subjects.");
    });
}

function handleResponse(response) {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
}

function showError(error) {
    console.error("Error: ", error);

    if (error.message.includes("401")) {
        alert("Session expired. Redirecting to login...");
        window.location.href = "../index.html";
    } else {
        alert(error.message || "An error occurred.");
    }
}

function getApprovedSubjects() {
    const token = localStorage.getItem("access_token");
    fetch(`${baseUrl}/getApprovedSubjects/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then(handleResponse)
        .then(data => {
            renderApprovedSubjects(data);
            approved = { ...data };
        })
        .catch(showError);
}

function getTeachersNames(teachersArray) {
    return teachersArray.map(teacherObj => Object.values(teacherObj)[0]); // Extracts the name from each object
}

function renderApprovedSubjects(approvedData) {
    const approvedContainer = document.querySelector("#approved .approved-container");
    approvedContainer.innerHTML = "";

    if (!approvedData.length) {
        approvedContainer.innerHTML = `<p class="emptyApproved">No subject is approved.</p>`;
        return;
    }

    const table = document.createElement("table");
    table.classList.add("approved-table");

    const tableHeader = `
        <thead>
            <tr>
                <th>
                    Subject Name<br>
                    <input type="text" class="subjectTable" id="subjectSearch" placeholder="Search Subject Name">
                </th>
                <th>
                    Subject Code<br>
                    <input type="text" class="subjectTable" id="codeSearch" placeholder="Search Subject Code">
                </th>
                <th>
                    Faculty<br>
                    <input type="text" class="subjectTable" id="facultySearch" placeholder="Search Faculty">
                </th>
            </tr>
        </thead>
    `;

    const tableBody = document.createElement("tbody");

    let lastSubject = null;
    approvedData.forEach(({ subject_name, subject_code, teachers }) => {
        const teachersName = getTeachersNames(teachers);
        const subjectDiv = createApprovedSubjectCard(subject_name, subject_code, teachersName, lastSubject);
        lastSubject = subjectDiv ? { subject_name, subject_code } : lastSubject;
        tableBody.appendChild(subjectDiv);
    });

    table.innerHTML = tableHeader;
    table.appendChild(tableBody);
    approvedContainer.appendChild(table);

    addSearchFilters();
}

function createApprovedSubjectCard(subject_name, subject_code, teachers, lastSubject) {
    const subjectDiv = document.createElement("tr");

    if (lastSubject && lastSubject.subject_name === subject_name && lastSubject.subject_code === subject_code) {
        // Merge this row with the previous one by not rendering subject name/code again
        subjectDiv.innerHTML = `
            <td></td>
            <td></td>
            <td>
                ${teachers.length > 0 
                    ? `<ul class="faculty-list">
                        ${teachers.map(teacher => `<li class="faculty-name">${teacher}</li>`).join('')}
                      </ul>`
                    : "<span class='faculty-name'>No faculty assigned</span>"}
            </td>
        `;
    } else {
        subjectDiv.innerHTML = `
            <td>${subject_name}</td>
            <td>${subject_code}</td>
            <td>
                ${teachers.length > 0 
                    ? `<ul class="faculty-list">
                        ${teachers.map(teacher => `<li class="faculty-name">${teacher}</li>`).join('')}
                      </ul>`
                    : "<span class='faculty-name'>No faculty assigned</span>"}
            </td>
        `;
    }

    return subjectDiv;
}

function addSearchFilters() {
    const subjectSearch = document.getElementById("subjectSearch");
    const codeSearch = document.getElementById("codeSearch");
    const facultySearch = document.getElementById("facultySearch");

    subjectSearch.addEventListener("input", filterTable);
    codeSearch.addEventListener("input", filterTable);
    facultySearch.addEventListener("input", filterTable);
}

function filterTable() {
    const subjectValue = document.getElementById("subjectSearch").value.toLowerCase();
    const codeValue = document.getElementById("codeSearch").value.toLowerCase();
    const facultyValue = document.getElementById("facultySearch").value.toLowerCase();

    const rows = document.querySelectorAll(".approved-table tbody tr");

    rows.forEach(row => {
        const subjectName = row.children[0].textContent.toLowerCase();
        const subjectCode = row.children[1].textContent.toLowerCase();
        const facultyNames = row.children[2].textContent.toLowerCase();

        const subjectMatch = subjectName.includes(subjectValue);
        const codeMatch = subjectCode.includes(codeValue);
        const facultyMatch = facultyNames.includes(facultyValue);

        if (subjectMatch && codeMatch && facultyMatch) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
