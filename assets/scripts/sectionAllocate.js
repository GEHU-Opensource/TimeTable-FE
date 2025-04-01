document.addEventListener("DOMContentLoaded", () => {
    function loadComponent(id, file) {
        fetch(file)
            .then(response => response.text())
            .then(data => {
                document.getElementById(id).innerHTML = data;
                attachNavbarEventListeners();
            });
    }
    
    function attachNavbarEventListeners() {
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                localStorage.clear();
                window.location.href = "../index.html";
            });
        }
    }
    
    function highlightActiveLink() {
        document.getElementById("current-year").textContent = new Date().getFullYear();
        const footer = document.querySelector("footer");
        function checkScrollbar() {
            if (document.body.scrollHeight <= window.innerHeight) {
                footer.classList.add("fixed");
            } else {
                footer.classList.remove("fixed");
            }
        }
        checkScrollbar();
        window.addEventListener("resize", checkScrollbar);
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll("nav ul li a");
        navLinks.forEach(link => {
            if (currentPath.endsWith(link.getAttribute("href"))) {
                link.classList.add("active");
            }
        });
    }
    loadComponent("navbar-admin", "../components/admin_navbar.html");
    loadComponent("footer", "../components/footer.html");
    setTimeout(highlightActiveLink, 100);

    const departmentDropdown = document.getElementById("department");
    const courseDropdown = document.getElementById("course");
    const branchDropdown = document.getElementById("branch");
    const yearDropdown = document.getElementById("year");
    const semesterDropdown = document.getElementById("semester");
    const sectionInput = document.getElementById("sections");
    const allocateButton = document.getElementById("allocate");
    const downloadButton = document.getElementById("download-btn");
    const timetable = document.getElementById("show");
    const fileInput = document.getElementById('tt');
    const fileChosen = document.getElementById('file-chosen');

    fileInput.addEventListener('change', () => {
        fileChosen.textContent = fileInput.files[0]?.name || "No file chosen";
    });

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
        const selectedDepartment = departments.find(department => department.name === departmentDropdown.value);
        const selectedCourse = selectedDepartment?.courses.find(course => course.name === courseDropdown.value);
        clearDropdown(branchDropdown);
        populateDropdown(branchDropdown, selectedCourse?.branches || [], "name", "name");
    });

    branchDropdown.addEventListener("change", function () {
        const selectedDepartment = departments.find(department => department.name === departmentDropdown.value);
        const selectedCourse = selectedDepartment?.courses.find(course => course.name === courseDropdown.value);
        const selectedBranch = selectedCourse?.branches.find(branch => branch.name === branchDropdown.value);
        clearDropdown(yearDropdown);
        populateDropdown(yearDropdown, selectedBranch?.years || [], "year", "year");
    });

    yearDropdown.addEventListener("change", function () {
        const selectedDepartment = departments.find(department => department.name === departmentDropdown.value);
        const selectedCourse = selectedDepartment?.courses.find(course => course.name === courseDropdown.value);
        const selectedBranch = selectedCourse?.branches.find(branch => branch.name === branchDropdown.value);
        const selectedYear = selectedBranch?.years.find(year => year.year === yearDropdown.value);
        clearDropdown(semesterDropdown);
        populateDropdown(semesterDropdown, selectedYear?.semesters || [], "sem", "sem");
    });

    allocateButton.addEventListener("click", function() {
        const data = {
            department: departmentDropdown.value,
            course: courseDropdown.value,
            branch: branchDropdown.value,
            year: yearDropdown.value,
            semester: semesterDropdown.value,
            sections: sectionInput,
            student_data: fileInput.files[0],
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
        
        const file = generateTT; // API:departmen/course/branch/year/semester

        if(typeof file !== "undefined") {
            fetch(file, {
                method: "GET",
                headers: {
                    // Add any required headers (e.g., authentication token if needed)
                    'Content-Type': 'application/json',
                },
            })
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
                    displaySheet(workbook, sheetNames[0]);
                })
                .catch((error) => {
                    alert("Failed to load the Excel file: " + error.message);
                });
        }
        else {
            alert("Excel file path is missing in data.js.");
        }
    });

    downloadButton.addEventListener('click', () => {
        const apiEndpoint = generateTT; // Replace with your API endpoint

        fetch(apiEndpoint, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok: " + response.statusText);
            }
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = contentDisposition && contentDisposition.includes('filename=') ? contentDisposition.split('filename=')[1].trim().replace(/"/g, '') : 'timeTable_new.xlsx'; // Default filename if not found

            return response.blob().then(blob => ({ filename, blob }));
        })
        .then(({ filename, blob }) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => {
            alert("Failed to download the file: " + error.message);
        });
    });

    function displaySheet(workbook, sheetName) {
        const sheet = workbook.Sheets[sheetName];
        const html = XLSX.utils.sheet_to_html(sheet);
        const outputDiv = document.getElementById("output");
        outputDiv.innerHTML = html;
    }
});