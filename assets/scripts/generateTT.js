document.addEventListener("DOMContentLoaded", function () {
    const departmentDropdown = document.getElementById("department");
    const courseDropdown = document.getElementById("course");
    const branchDropdown = document.getElementById("branch");
    const yearDropdown = document.getElementById("year");
    const semesterDropdown = document.getElementById("semester");
    const generateButton = document.getElementById("generateTT");
    const timetable = document.getElementById("show");

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

    generateButton.addEventListener("click", function() {
        const file = generateTT;
        if(typeof file !== "undefined") {
            fetch(file)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok " + response.statusText);
                    }
                    return response.arrayBuffer();
                })
                .then((data) => {
                    timetable.style.display = "block";
                    const workbook = XLSX.read(data, { type: "array" });
                    const sheetNames = workbook.SheetNames;
                    populateSheetSelector(sheetNames);
                    displaySheet(workbook, sheetNames[0]);
                    const sheetSelector = document.getElementById("sheet-selector");
                    sheetSelector.addEventListener("change", function () {
                        const selectedSheet = sheetSelector.value;
                        displaySheet(workbook, selectedSheet);
                    });
                })
                .catch((error) => {
                    alert("Failed to load the Excel file: " + error.message);
                });
        }
        else {
            alert("Excel file path is missing in data.js.");
        }
    });

    function populateSheetSelector(sheetNames) {
        const sheetSelector = document.getElementById("sheet-selector");
        sheetSelector.style.display = "inline";
        sheetSelector.innerHTML = "";
        sheetNames.forEach((sheetName) => {
            const option = document.createElement("option");
            option.value = sheetName;
            option.textContent = sheetName;
            sheetSelector.appendChild(option);
        });
    }

    function displaySheet(workbook, sheetName) {
        const sheet = workbook.Sheets[sheetName];
        const html = XLSX.utils.sheet_to_html(sheet);
        const outputDiv = document.getElementById("output");
        outputDiv.innerHTML = html;
    }
});