document.addEventListener("DOMContentLoaded", () => {
  const departmentDropdown = document.getElementById("department");
  const courseDropdown = document.getElementById("course");
  const branchDropdown = document.getElementById("branch");
  const yearDropdown = document.getElementById("year");
  const semesterDropdown = document.getElementById("semester");
  const generateButton = document.getElementById("generateTT");
  const downloadButton = document.getElementById("download-btn");
  const timetable = document.getElementById("show");
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
  } else {
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
    populateDropdown(
      courseDropdown,
      departments.find((dep) => dep.name === selectedDepartment)?.courses || [],
      "name",
      "name"
    );
  });

  courseDropdown.addEventListener("change", function () {
    const selectedDepartment = departments.find(
      (dept) => dept.name === departmentDropdown.value
    );
    const selectedCourse = selectedDepartment?.courses.find(
      (course) => course.name === courseDropdown.value
    );
    clearDropdown(branchDropdown);
    populateDropdown(
      branchDropdown,
      selectedCourse?.branches || [],
      "name",
      "name"
    );
  });

  branchDropdown.addEventListener("change", function () {
    const selectedDepartment = departments.find(
      (dept) => dept.name === departmentDropdown.value
    );
    const selectedCourse = selectedDepartment?.courses.find(
      (course) => course.name === courseDropdown.value
    );
    const selectedBranch = selectedCourse?.branches.find(
      (branch) => branch.name === branchDropdown.value
    );
    clearDropdown(yearDropdown);
    populateDropdown(yearDropdown, selectedBranch?.years || [], "year", "year");
  });

  yearDropdown.addEventListener("change", function () {
    const selectedDepartment = departments.find(
      (dept) => dept.name === departmentDropdown.value
    );
    const selectedCourse = selectedDepartment?.courses.find(
      (course) => course.name === courseDropdown.value
    );
    const selectedBranch = selectedCourse?.branches.find(
      (branch) => branch.name === branchDropdown.value
    );
    const selectedYear = selectedBranch?.years.find(
      (year) => year.year === yearDropdown.value
    );
    clearDropdown(semesterDropdown);
    populateDropdown(
      semesterDropdown,
      selectedYear?.semesters || [],
      "sem",
      "sem"
    );
  });

  generateButton.addEventListener("click", function () {
    const data = {
      department: departmentDropdown.value,
      course: courseDropdown.value,
      branch: branchDropdown.value !== "No Branch" ? branchDropdown.value : "",
      year: yearDropdown.value,
      semester: semesterDropdown.value,
    };
    if (!data.department || !data.course || !data.year || !data.semester) {
      alert("Fill the Details!");
      return;
    }
    if (branch === "") {
      //
    } else {
    }
    alert("TimeTable is Generated...Redirecting to the View Page");
    window.location.href = "../admin/viewTT.html";
    /*
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
        }*/
  });

  downloadButton.addEventListener("click", () => {
    const apiEndpoint = generateTT; // Replace with your API endpoint

    fetch(apiEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Network response was not ok: " + response.statusText
          );
        }
        const contentDisposition = response.headers.get("Content-Disposition");
        const filename =
          contentDisposition && contentDisposition.includes("filename=")
            ? contentDisposition.split("filename=")[1].trim().replace(/"/g, "")
            : "timeTable_new.xlsx"; // Default filename if not found

        return response.blob().then((blob) => ({ filename, blob }));
      })
      .then(({ filename, blob }) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        alert("Failed to download the file: " + error.message);
      });
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
