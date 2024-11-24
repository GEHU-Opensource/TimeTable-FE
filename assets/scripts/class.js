document.addEventListener('DOMContentLoaded', () => {
    const classTableBody = document.querySelector('#classTable tbody');
    const addClassBtn = document.getElementById('addClassBtn');
    const submitClassBtn = document.getElementById('submitClassBtn');

    if(typeof preData!=='undefined' && preData.classes) {
        preData.classes.forEach((classItem) => {
            addClassRow(classItem.code, classItem.capacity, classItem.type);
        });
    }
    else {
        console.error("Class data is not defined.");
    }

    addClassBtn.addEventListener('click', () => {
        addClassRow('', '', '');
    });

    submitClassBtn.addEventListener('click', () => {
        const classRows = document.querySelectorAll('#classTable tbody tr');
        const classData = [];
        let allFieldsFilled = true;
        classRows.forEach((row) => {
            const classCodeInput = row.querySelector('.class-code');
            const classCapacityInput = row.querySelector('.class-capacity');
            const classTypeSelect = row.querySelector('.class-type');

            if(classCodeInput && classCapacityInput && classTypeSelect) {
                const classCode = classCodeInput.value.trim();
                const classCapacity = classCapacityInput.value.trim();
                const classType = classTypeSelect.value;

                if(classCode && classCapacity && classType) {
                    classData.push({
                        code: classCode,
                        capacity: classCapacity,
                        type: classType,
                    });
                }
                else {
                    allFieldsFilled = false;
                }
            }
        });

        if(!allFieldsFilled) {
            alert("Please fill in all class details.");
            return;
        }
        if(classData.length > 0) {
            console.log('Submitted Class Data:', classData);
            alert("Check the console");
        }
        else {
            alert("No classes to submit.");
        }
    });

    function addClassRow(code = '', capacity = '', type = '') {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" class="class-code" placeholder="Enter Class Code" value="${code}" /></td>
            <td><input type="text" class="class-capacity" placeholder="Enter Capacity" value="${capacity}" /></td>
            <td>
                <select class="class-type">
                    <option value="" ${type === '' ? 'selected' : ''}>Select Type</option>
                    <option value="lt" ${type === 'lt' ? 'selected' : ''}>LT</option>
                    <option value="cr" ${type === 'cr' ? 'selected' : ''}>CR</option>
                    <option value="lab" ${type === 'lab' ? 'selected' : ''}>Lab</option>
                </select>
            </td>
            <td><button class="delete-btn">Delete</button></td>
        `;
        const deleteBtn = row.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            row.remove();
        });
        classTableBody.appendChild(row);
    }
});