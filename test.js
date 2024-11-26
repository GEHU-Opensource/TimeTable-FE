// Ensure data.js is included in your HTML file
// <script src="data.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    const existingClassTableBody = document.querySelector('#existingClassTable tbody');
    const newClassTableBody = document.querySelector('#classTable tbody');
    const addClassBtn = document.getElementById('addClassBtn');
    const submitClassBtn = document.getElementById('submitClassBtn');

    // Populate existing data from data.js
    preData.classes.forEach(item => addExistingRow(item.code, item.capacity, item.type));

    // Add new class row
    addClassBtn.addEventListener('click', () => {
        addNewClassRow('', '', '');
    });

    // Submit new class data
    submitClassBtn.addEventListener('click', () => {
        const rows = newClassTableBody.querySelectorAll('tr');
        const data = [];
        rows.forEach(row => {
            const code = row.querySelector('.class-code').value.trim();
            const capacity = row.querySelector('.class-capacity').value.trim();
            const type = row.querySelector('.class-type').value;
            if (code && capacity && type) {
                data.push({ code, capacity, type });
                console.log('New Class Data:', data);
            }
            else {
                alert("Please fill the Class Details!");
            }
        });
    });

    // Functions
    function addExistingRow(code, capacity, type) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" value="${code}" disabled></td>
            <td><input type="text" value="${capacity}" disabled></td>
            <td>
                <select disabled>
                    <option value="lt" ${type === 'lt' ? 'selected' : ''}>LT</option>
                    <option value="cr" ${type === 'cr' ? 'selected' : ''}>CR</option>
                    <option value="lab" ${type === 'lab' ? 'selected' : ''}>Lab</option>
                </select>
            </td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        const inputs = row.querySelectorAll('input, select');

        editBtn.addEventListener('click', () => {
            if (editBtn.textContent === 'Edit') {
                inputs.forEach(input => input.disabled = false);
                editBtn.textContent = 'Save';
            } else {
                inputs.forEach(input => input.disabled = true);
                if (inputs[0].value.trim() !== "" && inputs[1].value.trim() !== "" && inputs[2].value.trim() !== "") {
                    console.log('Edited Data:', {
                        code: inputs[0].value.trim(),
                        capacity: inputs[1].value.trim(),
                        type: inputs[2].value.trim(),
                    });
                    editBtn.textContent = 'Edit';
                } else {
                    alert("Please fill the Class Details!");
                    inputs.forEach(input => input.disabled = false); // Re-enable inputs for correction
                    return;
                }
            }
        });

        deleteBtn.addEventListener('click', () => {
            let result = confirm("Are you sure to Delete?");
            if(result) {
                row.remove();
            }
            else {
                return ;
            }
        });
        existingClassTableBody.appendChild(row);
    }

    function addNewClassRow(code, capacity, type) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" class="class-code" value="${code}" placeholder="Enter Class Code"></td>
            <td><input type="text" class="class-capacity" value="${capacity}" placeholder="Enter Class Code"></td>
            <td>
                <select class="class-type">
                    <option value="">Select Type</option>
                    <option value="lt" ${type === 'lt' ? 'selected' : ''}>LT</option>
                    <option value="cr" ${type === 'cr' ? 'selected' : ''}>CR</option>
                    <option value="lab" ${type === 'lab' ? 'selected' : ''}>Lab</option>
                </select>
            </td>
            <td>
                <button class="delete-btn">Delete</button>
            </td>
        `;
        const deleteBtn = row.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            let result = confirm("Are you sure to Delete?");
            if(result) {
                row.remove();
            }
            else {
                return ;
            }
        });
        newClassTableBody.appendChild(row);
    }
});
