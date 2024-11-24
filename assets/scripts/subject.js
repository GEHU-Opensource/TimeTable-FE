document.addEventListener('DOMContentLoaded', () => {
    const departmentSelect = document.getElementById('department');
    const courseSelect = document.getElementById('course');
    const branchSelect = document.getElementById('branch');
    const yearSelect = document.getElementById('year');
    const semesterSelect = document.getElementById('semester');
    const subjectTable = document.getElementById('subjectTable');
    const getSubjectsBtn = document.getElementById('getSubjects');
    const addSubjectBtn = document.getElementById('addSubjectBtn');
    const submitBtn = document.getElementById('submitBtn');

    if(typeof departments!=='undefined') {
        departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department.name;
            option.textContent = department.name;
            departmentSelect.appendChild(option);
        });
    }
    else {
        console.error("Departments data is not defined.");
    }

    addSubjectBtn.addEventListener('click', () => {
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
        const subjectTableBody = document.querySelector('#subjectListTable tbody');
        subjectTableBody.appendChild(newRow);
        newRow.querySelector('.delete-btn').addEventListener('click', () => {
            newRow.remove();
        });
    });

    submitBtn.addEventListener('click', () => {
        const selectedDepartment = departmentSelect.value;
        const selectedCourse = courseSelect.value;
        const selectedBranch = branchSelect.value;
        const selectedYear = yearSelect.value;
        const selectedSemester = semesterSelect.value;
        const data = {
            department: selectedDepartment,
            course: selectedCourse,
            branch: selectedBranch,
            year: selectedYear,
            semester: selectedSemester,
            subjects: []
        };
        const subjectRows = document.querySelectorAll('#subjectListTable tbody tr');
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
            console.log('Submitted Data:', data);
            alert("Check the Console");
            departmentSelect.value = "";
            courseSelect.value = "";
            branchSelect.value = "";
            yearSelect.value = "";
            semesterSelect.value = "";
            document.getElementById("subjectTable").style.display = "none";
        }
        else {
            alert("No subjects to submit.");
        }
    });

    getSubjectsBtn.addEventListener('click', () => {
        const selectedDepartment = departmentSelect.value;
        const selectedCourse = courseSelect.value;
        const selectedBranch = branchSelect.value;
        const selectedYear = yearSelect.value;
        const selectedSemester = semesterSelect.value;

        if(!selectedDepartment || !selectedCourse || !selectedBranch || !selectedYear || !selectedSemester) {
            alert("Please fill in all the fields.");
            return;
        }
        const department = departments.find(department => department.name === selectedDepartment);
        const course = department.courses.find(course => course.name === selectedCourse);
        const branch = course.branches.find(branch => branch.name === selectedBranch);
        const year = branch.years.find(year => year.year === selectedYear);
        const fetchedSubjects = branch.subjects;
        displaySubjects(fetchedSubjects);
    });

    function displaySubjects(subjects) {
        const subjectTableBody = document.querySelector('#subjectListTable tbody');
        subjectTableBody.innerHTML = '';
        subjects.forEach(subject => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="text" class="subject-code" value="${subject.code}" /></td>
                <td><input type="text" class="subject-name" value="${subject.name}" /></td>
                <td>
                    <div class="select-wrapper">
                        <select class="subject-credit">
                            <option value="0" ${subject.credit === "0" ? "selected" : ""}>0</option>
                            <option value="1" ${subject.credit === "1" ? "selected" : ""}>1</option>
                            <option value="2" ${subject.credit === "2" ? "selected" : ""}>2</option>
                            <option value="3" ${subject.credit === "3" ? "selected" : ""}>3</option>
                            <option value="4" ${subject.credit === "4" ? "selected" : ""}>4</option>
                        </select>
                    </div>
                </td>
                <td><button class="delete-btn">Delete</button></td>
            `;
            row.querySelector('.delete-btn').addEventListener('click', () => {
                row.remove();
            });
            subjectTableBody.appendChild(row);
        });
        subjectTable.style.display = 'block';
    }

    departmentSelect.addEventListener('change', () => {
        courseSelect.innerHTML = '<option value="" selected>Select Course</option>';
        branchSelect.innerHTML = '<option value="" selected>Select Branch</option>';
        yearSelect.innerHTML = '<option value="" selected>Select Year</option>';
        semesterSelect.innerHTML = '<option value="" selected>Select Semester</option>';
        const selectedDepartment = departmentSelect.value;
        if(selectedDepartment) {
            const department = departments.find(department => department.name === selectedDepartment);
            department.courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.name;
                option.textContent = course.name;
                courseSelect.appendChild(option);
            });
        }
    });

    courseSelect.addEventListener('change', () => {
        branchSelect.innerHTML = '<option value="" selected>Select Branch</option>';
        yearSelect.innerHTML = '<option value="" selected>Select Year</option>';
        semesterSelect.innerHTML = '<option value="" selected>Select Semester</option>';

        const selectedCourse = courseSelect.value;
        if (selectedCourse) {
            const selectedDepartment = departmentSelect.value;
            const department = departments.find(department => department.name === selectedDepartment);
            const course = department.courses.find(course => course.name === selectedCourse);
            course.branches.forEach(branch => {
                const option = document.createElement('option');
                option.value = branch.name;
                option.textContent = branch.name;
                branchSelect.appendChild(option);
            });
        }
    });

    branchSelect.addEventListener('change', () => {
        yearSelect.innerHTML = '<option value="" selected>Select Year</option>';
        semesterSelect.innerHTML = '<option value="" selected>Select Semester</option>';
        const selectedBranch = branchSelect.value;
        if(selectedBranch) {
            const selectedDepartment = departmentSelect.value;
            const selectedCourse = courseSelect.value;
            const department = departments.find(department => department.name === selectedDepartment);
            const course = department.courses.find(course => course.name === selectedCourse);
            const branch = course.branches.find(branch => branch.name === selectedBranch);
            branch.years.forEach(year => {
                const option = document.createElement('option');
                option.value = year.year;
                option.textContent = year.year;
                yearSelect.appendChild(option);
            });
        }
    });

    yearSelect.addEventListener('change', () => {
        semesterSelect.innerHTML = '<option value="" selected>Select Semester</option>';
        const selectedYear = yearSelect.value;
        if(selectedYear) {
            const selectedDepartment = departmentSelect.value;
            const selectedCourse = courseSelect.value;
            const selectedBranch = branchSelect.value;
            const department = departments.find(department => department.name === selectedDepartment);
            const course = department.courses.find(course => course.name === selectedCourse);
            const branch = course.branches.find(branch => branch.name === selectedBranch);
            const year = branch.years.find(year => year.year === selectedYear);
            year.semesters.forEach(semester => {
                const option = document.createElement('option');
                option.value = semester;
                option.textContent = semester;
                semesterSelect.appendChild(option);
            });
        }
    });
});
