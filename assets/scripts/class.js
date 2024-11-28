document.addEventListener('DOMContentLoaded', () => {
    const existingClassTableBody = document.querySelector('#existingClassTable tbody');
    const newClassTableBody = document.querySelector('#classTable tbody');
    const addClassBtn = document.getElementById('addClassBtn');
    const submitClassBtn = document.getElementById('submitClassBtn');
    const baseurl = "http://127.0.0.1:8000";
    
    fetch(`${baseurl}/getRooms/`, {
        method: "GET",
    })
    .then(response => {
        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(item => {
        addExistingRow(item.code, item.capacity, item.type);
    })
    .catch(error => {
        console.log("Error: ",error);
        alert("System Failure");
    });

    //preData.classes.forEach(item => addExistingRow(item.code, item.capacity, item.type));
    addClassBtn.addEventListener('click', () => {
        addNewClassRow('', '', '');
    });
    
    submitClassBtn.addEventListener('click', () => {
        const rows = newClassTableBody.querySelectorAll('tr');
        const data = [];
        rows.forEach(row => {
            const code = row.querySelector('.class-code').value.trim();
            const capacity = row.querySelector('.class-capacity').value.trim();
            const type = row.querySelector('.class-type').value;
            if(code && capacity && type) {
                data.push({ code, capacity, type });
                alert("Check the Console!");
                console.log('New Class Data:', data);
            }
            else {
                alert("Please fill the Class Details!");
            }
        });
        /*
        if (data.length > 0) {
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
        }
        else {
            console.log("No valid data to send.");
        }*/
    });

    function addExistingRow(code, capacity, type) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" value="${code}" disabled></td>
            <td><input type="number" min="0" value="${capacity}" disabled></td>
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
            const oldCode = inputs[0].value.trim(); // Store the old code before editing
        
            if (editBtn.textContent === 'Edit') {
                // Enable input fields for editing
                inputs.forEach(input => input.disabled = false);
                editBtn.textContent = 'Save';
            } else {
                // Disable inputs after saving
                inputs.forEach(input => input.disabled = true);
        
                // Validate inputs
                if (inputs[0].value.trim() !== "" && inputs[1].value.trim() !== "" && inputs[2].value.trim() !== "") {
                    // Prepare data for the API call
                    const classData = {
                        code: inputs[0].value.trim(),
                        capacity: inputs[1].value.trim(),
                        type: inputs[2].value.trim(),
                    };
                    console.log(classData);
                    /*
                    fetch(`api/${oldCode}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json", // Indicate JSON data format
                        },
                        body: JSON.stringify(classData), // Convert object to JSON string
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.json(); // Parse JSON response
                        })
                        .then(updatedData => {
                            console.log("Updated data from server:", updatedData);
                            alert("Class details updated successfully!");
                            editBtn.textContent = 'Edit';
                        })
                        .catch(error => {
                            console.error("Error updating class details:", error);
                            alert("Failed to update class details. Please try again.");
                            // Re-enable inputs for correction in case of failure
                            inputs.forEach(input => input.disabled = false);
                        });*/
                        
                    editBtn.textContent = 'Edit';
                }
                else {
                    alert("Please fill the Class Details!");
                    inputs.forEach(input => input.disabled = false); // Re-enable inputs for correction
                    return;
                }
            }
        });        

        deleteBtn.addEventListener('click', () => {
            let result = confirm("Are you sure to Delete?");
            if(result) {
                const inputs = row.querySelectorAll('input, select');
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
        existingClassTableBody.appendChild(row);
    }

    function addNewClassRow(code, capacity, type) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" class="class-code" value="${code}" placeholder="Enter Class Code"></td>
            <td><input type="number" min="0" class="class-capacity" value="${capacity}" placeholder="Enter Class Code"></td>
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