document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = BE_URL;
    const departmentDropdown = document.getElementById("department");
    const courseDropdown = document.getElementById("course");
    const branchDropdown = document.getElementById("branch");
    const yearDropdown = document.getElementById("year");
    const semesterDropdown = document.getElementById("semester");
    const professorWeeklyLoad = document.getElementById("professorLoad");
    const adjunctWeeklyLoad = document.getElementById("adjunctLoad");
    const hodWeeklyLoad = document.getElementById("hodLoad");
    const assistantProfessorWeeklyLoad = document.getElementById("assistant_professorLoad");
    const lecturerWeeklyLoad = document.getElementById("lecturerLoad");
    const labAssistantWeeklyLoad = document.getElementById("lab_assistantLoad");
    const generateButton = document.getElementById("generateTT");
    const downloadButton = document.getElementById("download-btn");
    const timetable = document.getElementById("show");
    const addTimeSlotButton = document.getElementById("add-time-slot");
    const logoutBtn = document.querySelector(".logout-btn");

    logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "../index.html";
    });

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
            (department) => department.name === departmentDropdown.value
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
            (department) => department.name === departmentDropdown.value
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
            (department) => department.name === departmentDropdown.value
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

    addTimeSlotButton.addEventListener("click", function () {
        const tbody = document.getElementById("time-slot-body");

        const row = document.createElement("tr");
        row.classList.add("sortable");

        row.innerHTML = `
            <td><input type="time" class="time-slot-input start-time"></td>
            <td><input type="time" class="time-slot-input end-time"></td>
            <td><button class="delete-btn"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
        `;

        tbody.appendChild(row);
        makeRowsSortable();
    });

    document.getElementById("time-slot-body").addEventListener("click", function (event) {
        if (event.target.closest(".delete-btn")) {
            const row = event.target.closest("tr");
            const startTime = row.querySelector(".start-time").value;
            const endTime = row.querySelector(".end-time").value;
            if (!startTime && !endTime) {
                row.remove();
            } else {
                if (confirm("This row contains data. Are you sure you want to delete it?")) {
                    row.remove();
                }
            }
        }
    });

    function makeRowsSortable() {
        let draggedRow = null;
        const tbody = document.getElementById("time-slot-body");

        tbody.querySelectorAll("tr").forEach(row => {
            row.draggable = true;

            row.addEventListener("dragstart", function () {
                draggedRow = this;
                setTimeout(() => this.style.opacity = "0.5", 0);
            });

            row.addEventListener("dragend", function () {
                setTimeout(() => this.style.opacity = "1", 0);
                draggedRow = null;
            });

            row.addEventListener("dragover", function (e) {
                e.preventDefault();
                const rows = Array.from(tbody.children);
                const indexDragged = rows.indexOf(draggedRow);
                const indexOver = rows.indexOf(this);

                if (indexDragged > indexOver) {
                    tbody.insertBefore(draggedRow, this);
                } else {
                    tbody.insertBefore(draggedRow, this.nextSibling);
                }
            });
        });
    }

    generateButton.addEventListener("click", function () {
        const data = {
            department: departmentDropdown.value,
            course: courseDropdown.value,
            branch: branchDropdown.value,
            year: yearDropdown.value,
            semester: semesterDropdown.value,
            weekly_workload: {
                professor: professorWeeklyLoad.value,
                adjunct: adjunctWeeklyLoad.value,
                hod: hodWeeklyLoad.value,
                assistant_professor: assistantProfessorWeeklyLoad.value,
                lecturer: lecturerWeeklyLoad.value,
                lab_assistant: labAssistantWeeklyLoad.value,
            },
            time_slots: []
        };

        document.querySelectorAll("#time-slot-body tr").forEach((row, index) => {
            const startTime = row.querySelector(".start-time").value;
            const endTime = row.querySelector(".end-time").value;

            if (startTime && endTime) {
                const format12HourWithoutAMPM = (time) => {
                    let [hour, minute] = time.split(":");
                    hour = parseInt(hour);
                    let formattedHour = hour % 12 || 12; // Convert 24-hour to 12-hour format
                    return `${formattedHour}:${minute}`;
                };

                data.time_slots[index + 1] = `${format12HourWithoutAMPM(startTime)} - ${format12HourWithoutAMPM(endTime)}`;
            }
        });

        console.log(data);

        if (!data.department || !data.course || !data.year || !data.semester) {
            alert("Fill in all the details");
            return;
        }
        if (
            data.weekly_workload.professor === "0" ||
            data.weekly_workload.adjunct === "0" ||
            data.weekly_workload.hod === "0" ||
            data.weekly_workload.assistant_professor === "0" ||
            data.weekly_workload.lecturer === "0" ||
            data.weekly_workload.lab_assistant === "0"
        ) {
            console.log(data.weekly_workload.professor);
            console.log(data.weekly_workload.adjunct);
            console.log(data.weekly_workload.hod);
            console.log(data.weekly_workload.assistant_professor);
            console.log(data.weekly_workload.lecturer);
            console.log(data.weekly_workload.lab_assistant);
            alert("Enter the Weekly Load!");
            return;
        }
        
        if (data.time_slots.length === 0) {
            alert("Add at least one time slot!");
            return;
        }
        const token = localStorage.getItem("access_token");

        fetch(`${baseUrl}/generateTimetable/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(responseData => {
                console.log("Timetable generated successfully:", responseData);
                alert("Timetable generated successfully!");
            })
            .catch(error => {
                console.error("Error generating timetable:", error);
                alert("Failed to generate the timetable: " + error.message);
            });
    });

    downloadButton.addEventListener("click", () => {
        fetch(`${baseUrl}/downloadTimetable/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => {
                if (!response.ok) throw new Error("Download failed");
                return response.blob();
            })
            .then(blob => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "timetable.xlsx";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => {
                alert("Failed to download the file: " + error.message);
            });
    });
});
