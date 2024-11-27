document.addEventListener("DOMContentLoaded", function () {
    const departmentDropdown = document.getElementById("department");
    const courseDropdown = document.getElementById("course");
    const branchDropdown = document.getElementById("branch");
    const yearDropdown = document.getElementById("year");
    const semesterDropdown = document.getElementById("semester");
    const getSubjectsButton = document.getElementById("getSubjects");
    const existingSubjectTableBody = document.querySelector("#subjectListTable tbody");
    const newSubjectTableBody = document.querySelector("#newSubjectTable tbody");
    const addSubjectBtn = document.getElementById("addSubjectBtn");
    const submitBtn = document.getElementById("submitBtn");

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

    function clearDropdown(dropdown) {
        dropdown.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select an option';
        dropdown.appendChild(defaultOption);
    }

    function populateDropdown(dropdown, options, valueKey, textKey) {
        options.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option[valueKey];
            opt.textContent = option[textKey];
            dropdown.appendChild(opt);
        });
    }

    departmentDropdown.addEventListener("change", function () {
        const selectedDepartment = departmentDropdown.value;
        clearDropdown(courseDropdown);
        populateDropdown(courseDropdown, departments.find(dep => dep.name === selectedDepartment)?.courses || [], "name", "name");
    });

    courseDropdown.addEventListener("change", function () {
        const selectedDepartment = departments.find(dept => dept.name === departmentDropdown.value);
        const selectedCourse = selectedDepartment?.courses.find(course => course.name === courseDropdown.value);
        clearDropdown(branchDropdown);
        populateDropdown(branchDropdown, selectedCourse?.branches || [], "name", "name");
    });

    branchDropdown.addEventListener("change", function () {
        const selectedDepartment = departments.find(dept => dept.name === departmentDropdown.value);
        const selectedCourse = selectedDepartment?.courses.find(course => course.name === courseDropdown.value);
        const selectedBranch = selectedCourse?.branches.find(branch => branch.name === branchDropdown.value);
        clearDropdown(yearDropdown);
        populateDropdown(yearDropdown, selectedBranch?.years || [], "year", "year");
    });

    yearDropdown.addEventListener("change", function () {
        const selectedDepartment = departments.find(dept => dept.name === departmentDropdown.value);
        const selectedCourse = selectedDepartment?.courses.find(course => course.name === courseDropdown.value);
        const selectedBranch = selectedCourse?.branches.find(branch => branch.name === branchDropdown.value);
        const selectedYear = selectedBranch?.years.find(year => year.year === yearDropdown.value);
        clearDropdown(semesterDropdown);
        populateDropdown(semesterDropdown, selectedYear?.semesters || [], "sem", "sem");
    });

    function displayExistingSubjects(subjects) {
        existingSubjectTableBody.innerHTML = '';
        subjects.forEach(subject => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="text" class="subject-code" value="${subject.code}" disabled /></td>
                <td><input type="text" class="subject-name" value="${subject.name}" disabled /></td>
                <td>
                    <select class="subject-credit" disabled>
                        <option value="0" ${subject.credit === "0" ? "selected" : ""}>0</option>
                        <option value="1" ${subject.credit === "1" ? "selected" : ""}>1</option>
                        <option value="2" ${subject.credit === "2" ? "selected" : ""}>2</option>
                        <option value="3" ${subject.credit === "3" ? "selected" : ""}>3</option>
                        <option value="4" ${subject.credit === "4" ? "selected" : ""}>4</option>
                    </select>
                </td>
                <td>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </td>
            `;
            const editButton = row.querySelector('.edit-btn');
            const deleteButton = row.querySelector('.delete-btn');
            const inputs = row.querySelectorAll('input, select');
            editButton.addEventListener('click', () => {
                if(editButton.textContent === "Edit") {
                    inputs.forEach(input => input.disabled = false);
                    editButton.textContent = 'Save';
                }
                else {
                    const selectedDepartment = departmentDropdown.value;
                    const selectedCourse = courseDropdown.value;
                    const selectedBranch = branchDropdown.value;
                    const selectedYear = yearDropdown.value;
                    const selectedSemester = semesterDropdown.value;
                    const data = {
                        department: selectedDepartment,
                        course: selectedCourse,
                        branch: selectedBranch,
                        year: selectedYear,
                        semester: selectedSemester,
                        subjects: []
                    };
                    inputs.forEach(input => input.disabled = true);
                    if(inputs[0].value.trim() !== "" && inputs[1].value.trim() !== "" && inputs[2].value.trim() !== "") {
                        const editedsubject = {
                            code: inputs[0].value.trim(),
                            name: inputs[1].value.trim(),
                            credit: inputs[2].value.trim(),
                        };
                        data.subjects.push(editedsubject);
                        console.log('Edited Data:', data);
                        editButton.textContent = 'Edit';
                    }
                    else {
                        alert("Please fill the Class Details!");
                        inputs.forEach(input => input.disabled = false); // Re-enable inputs for correction
                        return;
                    }
                }
            });
            deleteButton.addEventListener('click', () => {
                let result = confirm("Are you sure to Delete?");
                if(result) {
                    row.remove();
                    /*
                    fetch(`api/${inputs[0].value.trim()}`, {
                        method: "DELETE", // Use the HTTP DELETE method
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json(); // Parse JSON response if needed
                    })
                    .then(data => {
                        console.log("Deletion successful:", data);
                        alert("Item deleted successfully!");
                    })
                    .catch(error => {
                        console.error("Error deletingitem:", error);
                        alert("Failed to delete item. Please try again.");
                    });*/
                }
                else {
                    return ;
                }
            });
            existingSubjectTableBody.appendChild(row);
        });
    }

    getSubjectsButton.addEventListener("click", function () {
        const subjectDatas = document.getElementById("subjectData");
        subjectDatas.style.display = "block";
        const selectedDepartment = departmentDropdown.value;
        const selectedCourse = courseDropdown.value;
        const selectedBranch = branchDropdown.value;
        const selectedYear = yearDropdown.value;
        const selectedSemester = semesterDropdown.value;
        const params = new URLSearchParams({
            department: selectedDepartment,
            course: selectedCourse,
            branch: selectedBranch,
            year: selectedYear,
            semester: selectedSemester,
        });
        if(!selectedDepartment || !selectedCourse || !selectedBranch || !selectedYear || !selectedSemester) {
            alert("Please fill in all the fields.");
            return;
        }
        const department = departments.find(department => department.name === selectedDepartment);
        const course = department.courses.find(course => course.name === selectedCourse);
        const branch = course.branches.find(branch => branch.name === selectedBranch);
        const year = branch.years.find(year => year.year === selectedYear);
        const semester = year.semesters.find(sem => sem.sem === selectedSemester);
        const fetchedSubjects = semester.subjects;
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
        .then(fetchedSubjects => {
            displayExistingSubjects(fetchedSubjects);
        })
        .catch(error => {
            console.log("Error: ",error);
            alert("System Failure");
        });*/
        displayExistingSubjects(fetchedSubjects);
    });

    addSubjectBtn.addEventListener("click", function () {
        const newRow = document.createElement('tr');
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
        const deleteButton = newRow.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
            let result = confirm("Are you sure to Delete?");
            if(result) {
                newRow.remove();
            }
            else {
                return ;
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
        const data = {
            department: selectedDepartment,
            course: selectedCourse,
            branch: selectedBranch,
            year: selectedYear,
            semester: selectedSemester,
            subjects: []
        };
        const subjectRows = document.querySelectorAll('#newSubjectTable tr');
        let allFieldsFilled = true;

        subjectRows.forEach(row => {
            const subjectCodeInput = row.querySelector('.subject-code');
            const subjectNameInput = row.querySelector('.subject-name');
            const subjectCreditInput = row.querySelector('.subject-credit');

            if(subjectCodeInput && subjectNameInput && subjectCreditInput) {
                const subjectCode = subjectCodeInput.value.trim();
                const subjectName = subjectNameInput.value.trim();
                const subjectCredit = subjectCreditInput.value.trim();

                if(subjectCode && subjectName && subjectCredit) {
                    const subject = {
                        code: subjectCode,
                        name: subjectName,
                        credit: subjectCredit
                    };
                    data.subjects.push(subject);
                }
                else {
                    allFieldsFilled = false;
                }
            }
        });

        if(!allFieldsFilled) {
            alert("Please fill in all subject details.");
            return;
        }
        if(data.subjects.length > 0) {
            fetch("api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Inform the server about the JSON format
                },
                body: JSON.stringify(data), // Convert the array of objects to a JSON string
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // Parse the JSON response
            })
            .then(serverResponse => {
                console.log("Server Response:", serverResponse);
                alert("Classes added successfully!");
            })
            .catch(error => {
                console.error("Error adding classes:", error);
                alert("Failed to add classes. Please try again.");
            });
            console.log('Submitted Data:', data);
            alert("Check the Console");
        }
        else {
            alert("No subjects to submit.");
        }
    });
});