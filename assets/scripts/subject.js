document.addEventListener("DOMContentLoaded", () => {
    const departmentDropdown = document.getElementById("department");
    const courseDropdown = document.getElementById("course");
    const branchDropdown = document.getElementById("branch");
    const yearDropdown = document.getElementById("year");
    const semesterDropdown = document.getElementById("semester");
    const getSubjectsButton = document.getElementById("getSubjects");
    const existingSubjectTableBody = document.querySelector(
        "#subjectListTable tbody"
    );
    const newSubjectTableBody = document.querySelector(
        "#newSubjectTable tbody"
    );
    const baseUrl = "http://127.0.0.1:8000";
    const addSubjectBtn = document.getElementById("addSubjectBtn");
    const submitBtn = document.getElementById("submitBtn");
    const logoutBtn = document.querySelector(".logout-btn");
    logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "../login.html";
    });

    if (typeof departments !== "undefined") {
        departments.forEach((department) => {
            const option = document.createElement("option");
            option.value = department.name;
            option.textContent = department.name;
            departmentDropdown.appendChild(option);
        });
    }
    else {
        console.error("Departments data is not defined.");
    }

    function clearDropdown(dropdown) {
        dropdown.innerHTML = "";
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select an option";
        dropdown.appendChild(defaultOption);
    }

    function populateDropdown(dropdown, options, valueKey, textKey) {
        options.forEach((option) => {
            const opt = document.createElement("option");
            opt.value = option[valueKey];
            opt.textContent = option[textKey];
            dropdown.appendChild(opt);
        });
    }

    departmentDropdown.addEventListener("change", function () {
        const selectedDepartment = departmentDropdown.value;
        clearDropdown(courseDropdown);
        populateDropdown(courseDropdown, departments.find((dep) => dep.name === selectedDepartment)?.courses || [], "name", "name");
    });

    courseDropdown.addEventListener("change", function () {
        const selectedDepartment = departments.find((dept) => dept.name === departmentDropdown.value);
        const selectedCourse = selectedDepartment?.courses.find((course) => course.name === courseDropdown.value);
        clearDropdown(branchDropdown);
        populateDropdown(branchDropdown, selectedCourse?.branches || [], "name", "name");
    });

    branchDropdown.addEventListener("change", function () {
        const selectedDepartment = departments.find((dept) => dept.name === departmentDropdown.value);
        const selectedCourse = selectedDepartment?.courses.find((course) => course.name === courseDropdown.value);
        const selectedBranch = selectedCourse?.branches.find((branch) => branch.name === branchDropdown.value);
        clearDropdown(yearDropdown);
        populateDropdown(yearDropdown, selectedBranch?.years || [], "year", "year");
    });

    yearDropdown.addEventListener("change", function () {
        const selectedDepartment = departments.find((dept) => dept.name === departmentDropdown.value);
        const selectedCourse = selectedDepartment?.courses.find((course) => course.name === courseDropdown.value);
        const selectedBranch = selectedCourse?.branches.find((branch) => branch.name === branchDropdown.value);
        const selectedYear = selectedBranch?.years.find((year) => year.year === yearDropdown.value);
        clearDropdown(semesterDropdown);
        populateDropdown(semesterDropdown, selectedYear?.semesters || [], "sem", "sem");
    });

    function displayExistingSubjects(subjects) {
        existingSubjectTableBody.innerHTML = "";
        subjects.forEach((subject) => {
            const row = document.createElement("tr");
            row.dataset.subjectId = subject.id;
            row.innerHTML = `
                    <td><input type="text" class="subject-code" value="${subject.subject_code}" disabled /></td>
                    <td><input type="text" class="subject-name" value="${subject.subject_name}" disabled /></td>
                    <td>
                        <select class="subject-credit" disabled>
                            <option value="0" ${subject.credits === 0 ? "selected" : ""}>0</option>
                            <option value="1" ${subject.credits === 1 ? "selected" : ""}>1</option>
                            <option value="2" ${subject.credits === 2 ? "selected" : ""}>2</option>
                            <option value="3" ${subject.credits === 3 ? "selected" : ""}>3</option>
                            <option value="4" ${subject.credits === 4 ? "selected" : ""}>4</option>
                        </select>
                    </td>
                    <td>
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    </td>
                `;
            const editButton = row.querySelector(".edit-btn");
            const deleteButton = row.querySelector(".delete-btn");
            const inputs = row.querySelectorAll("input, select");
            editButton.addEventListener("click", () => {
                if (editButton.textContent === "Edit") {
                    inputs.forEach((input) => (input.disabled = false));
                    editButton.textContent = "Save";
                }
                else {
                    const selectedDepartment = departmentDropdown.value;
                    const selectedCourse = courseDropdown.value;
                    const selectedBranch = branchDropdown.value;
                    const selectedSemester = semesterDropdown.value;
                    const data = {
                        dept: selectedDepartment,
                        course: selectedCourse,
                        branch: selectedBranch,
                        semester: selectedSemester,
                        subjects: [],
                    };
                    if (inputs[0].value.trim() !== "" && inputs[1].value.trim() !== "" && inputs[2].value.trim() !== "") {
                        const editedsubject = {
                            subject_code: inputs[0].value.trim(),
                            subject_name: inputs[1].value.trim(),
                            credits: inputs[2].value.trim(),
                        };
                        data.subjects.push(editedsubject);
                        fetch(`${baseUrl}/updateSubject/${row.dataset.subjectId}/`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json", },
                            body: JSON.stringify(editedsubject),
                        })
                            .then((response) => {
                                if (!response.ok) {
                                    return response.json().then((data) => {
                                        throw new Error(
                                            data.error || "Failed to save data. Please try again."
                                        );
                                    });
                                }
                                return response.json();
                            })
                            .then((responseData) => {
                                alert("Subject updation successful!");
                                editButton.textContent = "Edit";
                                inputs.forEach((input) => (input.disabled = true));
                            })
                            .catch((error) => {
                                console.error("Error submitting data:", error);
                                alert(error.message);
                            });
                    } else {
                        alert("Please fill all the Subject Details!");
                        inputs.forEach((input) => (input.disabled = false));
                        return;
                    }
                }
            });

            deleteButton.addEventListener("click", () => {
                let result = confirm("Are you sure to Delete?");
                if (result) {
                    row.remove();
                    fetch(`${baseUrl}/deleteSubject/${row.dataset.subjectId}/`, {
                        method: "DELETE",
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then((data) => {
                            alert(data.message);
                        })
                        .catch((error) => {
                            console.error("Error deleting subject:", error);
                            alert("Failed to delete subject. Please try again.");
                        });
                } else {
                    return;
                }
            });
            existingSubjectTableBody.appendChild(row);
        });
    }

    getSubjectsButton.addEventListener("click", function () {
        const selectedDepartment = departmentDropdown.value;
        const selectedCourse = courseDropdown.value;
        const selectedBranch = branchDropdown.value;
        const selectedSemester = semesterDropdown.value;
        const params = new URLSearchParams({
            dept: selectedDepartment,
            course: selectedCourse,
            branch: selectedBranch,
            semester: selectedSemester,
        });
        if (
            !selectedDepartment ||
            !selectedCourse ||
            !selectedBranch ||
            !selectedSemester
        ) {
            alert("Please fill in all the fields.");
            return;
        }
        fetch(`${baseUrl}/getFilteredSubjects/filter?${params.toString()}`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((fetchedSubjects) => {
                displayExistingSubjects(fetchedSubjects);
            })
            .catch((error) => {
                console.error("Error: ", error);
                alert("System Failure");
            });

        const subjectDatas = document.getElementById("subjectData");
        newSubjectTableBody.textContent = "";
        subjectDatas.style.display = "block";
    });

    addSubjectBtn.addEventListener("click", function () {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
                <td><input type="text" class="subject-code" placeholder="Enter Subject Code" /></td>
                <td><input type="text" class="subject-name" placeholder="Enter Subject Name" /></td>
                <td>
                    <select class="subject-credit">
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </td>
                <td><button class="delete-btn">Delete</button></td>
            `;
        const deleteButton = newRow.querySelector(".delete-btn");
        deleteButton.addEventListener("click", () => {
            let result = confirm("Are you sure to Delete?");
            if (result) {
                newRow.remove();
            } else {
                return;
            }
        });
        newSubjectTableBody.appendChild(newRow);
    });

    submitBtn.addEventListener("click", function () {
        const selectedDepartment = departmentDropdown.value;
        const selectedCourse = courseDropdown.value;
        const selectedBranch = branchDropdown.value;
        const selectedYear = yearDropdown.value;
        const selectedSemester = semesterDropdown.value;
        const data = [];
        const subjectRows = document.querySelectorAll("#newSubjectTable tr");
        let allFieldsFilled = true;

        subjectRows.forEach((row) => {
            const subjectCodeInput = row.querySelector(".subject-code");
            const subjectNameInput = row.querySelector(".subject-name");
            const subjectCreditInput = row.querySelector(".subject-credit");

            if (subjectCodeInput && subjectNameInput && subjectCreditInput) {
                const subjectCode = subjectCodeInput.value.trim();
                const subjectName = subjectNameInput.value.trim();
                const subjectCredit = subjectCreditInput.value.trim();

                if (subjectCode && subjectName && subjectCredit) {
                    const subject = {
                        dept: selectedDepartment,
                        course: selectedCourse,
                        branch: selectedBranch !== "No Branch" ? selectedBranch : "",
                        year: selectedYear,
                        semester: selectedSemester,
                        subject_code: subjectCode,
                        subject_name: subjectName,
                        credits: subjectCredit,
                    };
                    data.push(subject);
                } else {
                    allFieldsFilled = false;
                }
            }
        });

        if (!allFieldsFilled) {
            alert("Please fill in all subject details.");
            return;
        }

        if (data.length > 0) {
            fetch(`${baseUrl}/addSubject/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then((data) => {
                            const errorMessage = data.errors
                                ? data.errors
                                    .map(
                                        (error) =>
                                            `${error.subject_data.subject_code}: ${error.error}`
                                    )
                                    .join("\n")
                                : data.error || "Failed to add subjects. Please try again.";

                            throw new Error(errorMessage);
                        });
                    }
                    return response.json();
                })
                .then((serverResponse) => {
                    if (serverResponse.message) {
                        alert(serverResponse.message);
                    }

                    if (serverResponse.subjects) {
                        console.log(
                            "Subjects added successfully:",
                            serverResponse.subjects
                        );
                    }

                    getSubjectsButton.click();
                })
                .catch((error) => {
                    console.error("Error adding subjects:", error);
                    alert(error.message || "Failed to add subjects. Please try again.");
                });
        } else {
            alert("No subjects to submit.");
        }
    });
});