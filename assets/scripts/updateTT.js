document.addEventListener("DOMContentLoaded", () => {
    const departmentDropdown = document.getElementById("department");
    const courseDropdown = document.getElementById("course");
    const branchDropdown = document.getElementById("branch");
    const yearDropdown = document.getElementById("year");
    const semesterDropdown = document.getElementById("semester");
    const updateButton = document.getElementById("updateTT");
    const fileInput = document.getElementById('tt');
    const fileChosen = document.getElementById('file-chosen');
    const logoutBtn = document.querySelector(".logout-btn");
      logoutBtn.addEventListener("click", () => {
          localStorage.clear();
          window.location.href = "../login.html";
      });

    fileInput.addEventListener('change', () => {
        fileChosen.textContent = fileInput.files[0]?.name || "No file chosen";
    });

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

    if (typeof departments !== 'undefined') {
        departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department.name;
            option.textContent = department.name;
            departmentDropdown.appendChild(option);
        });
    } else {
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

    updateButton.addEventListener("click", function () {
        const data = {
            department: departmentDropdown.value,
            course: courseDropdown.value,
            branch: branchDropdown.value !== "No Branch" ? branchDropdown.value : "",
            year: yearDropdown.value,
            semester: semesterDropdown.value,
            ttFile: fileInput.files[0],
        };
        if(!data.department || !data.course || !data.year || !data.semester) {
            alert("Fill the Details!");
            return ;
        }
        
        if(!fileInput.files.length) {
            alert("Please select a file before submitting.");
            return;
        }

        console.log("Form Data:", data);
        alert("Updated successfully!");
        /*
        fetch("api", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Success:", data);
            alert("Timetable updated successfully!");
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to update timetable. Please try again.");
        });*/
    });
});