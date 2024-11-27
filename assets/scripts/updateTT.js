document.addEventListener("DOMContentLoaded", function () {
    const departmentDropdown = document.getElementById("department");
    const courseDropdown = document.getElementById("course");
    const branchDropdown = document.getElementById("branch");
    const yearDropdown = document.getElementById("year");
    const semesterDropdown = document.getElementById("semester");
    const updateButton = document.getElementById("updateTT");
    const fileInput = document.getElementById('tt');
    const fileChosen = document.getElementById('file-chosen');

    fileInput.addEventListener('change', () => {
        fileChosen.textContent = fileInput.files[0]?.name || "No file chosen";
    });

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
        const formData = new FormData();
        const selectedFile = fileInput.files[0];
        formData.append("department", departmentDropdown.value);
        formData.append("course", courseDropdown.value);
        formData.append("branch", branchDropdown.value);
        formData.append("year", yearDropdown.value);
        formData.append("semester", semesterDropdown.value);
        if (selectedFile) {
            formData.append("ttFile", selectedFile);
        } else {
            alert("Please select a file before submitting.");
            return;
        }
        console.log("FormData Contents:");
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        alert("Timetable updated successfully!");
        /*
        fetch("https://your-backend-endpoint.com/update-timetable", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
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