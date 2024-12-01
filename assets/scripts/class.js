document.addEventListener("DOMContentLoaded", () => {
  const existingClassTableBody = document.querySelector(
    "#existingClassTable tbody"
  );
  const newClassTableBody = document.querySelector("#classTable tbody");
  const addClassBtn = document.getElementById("addClassBtn");
  const submitClassBtn = document.getElementById("submitClassBtn");
  const baseUrl = BE_URL;
  const logoutBtn = document.querySelector(".logout-btn");
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../login.html";
  });

  fetchRooms();

  addClassBtn.addEventListener("click", () => {
    addNewClassRow("", "", "");
  });

  submitClassBtn.addEventListener("click", handleSubmitClasses);
  function fetchRooms() {
    const token = localStorage.getItem("access_token");
    fetch(`${baseUrl}/getRooms/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((rooms) => {
        if (Array.isArray(rooms)) {
          rooms.forEach((room) =>
            addExistingRow(
              room.id,
              room.room_code,
              room.capacity,
              room.room_type
            )
          );
        } else {
          console.log("No rooms found");
        }
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
        alert("Failed to fetch rooms. Please try again.");
      });
  }

  function handleSubmitClasses() {
    const rows = newClassTableBody.querySelectorAll("tr");
    const roomData = [];

    rows.forEach((row) => {
      const data = {
        room_code: row.querySelector(".class-code").value.trim(),
        capacity: row.querySelector(".class-capacity").value.trim(),
        room_type: row.querySelector(".class-type").value.trim(),
      };

      if (validateRoomData(data)) {
        roomData.push(data);
      }
    });

    if (roomData.length > 0) {
      const token = localStorage.getItem("access_token");
      fetch(`${baseUrl}/addRoom/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw errorData;
            });
          }
          return response.json();
        })
        .then((response) => {
          let successMessage = "Rooms added successfully!";
          let errorMessage = "";

          if (response.errors && response.errors.length > 0) {
            errorMessage =
              "Failed to add the following rooms due to existing room codes:\n";
            response.errors.forEach((error) => {
              errorMessage += `Room code: ${error.room_data.room_code} - ${error.error}\n`;
            });
          }

          if (response.added_rooms && response.added_rooms.length > 0) {
            successMessage += `\nSuccessfully added the following rooms:\n`;
            response.added_rooms.forEach((room) => {
              successMessage += `Room code: ${room.room_code}, Capacity: ${room.capacity}, Type: ${room.room_type}\n`;
            });
          }

          if (errorMessage) {
            alert(errorMessage);
          } else {
            alert(successMessage);
          }

          window.location.reload();
        })
        .catch((error) => {
          console.error("Error adding rooms:", error);
          if (error && error.errors) {
            alert(`Error: ${error.errors.map((err) => err.error).join(", ")}`);
          } else if (error && error.message) {
            alert(`Error: ${error.message}`);
          } else {
            alert("Failed to add rooms. Please try again.");
          }
        });
    } else {
      alert("Please fill in all required fields before submitting!");
    }
  }

  function validateRoomData(data) {
    if (!data.room_code || !data.capacity || !data.room_type) {
      alert("All fields (room code, capacity, and room type) are required.");
      return false;
    }
    if (isNaN(data.capacity) || parseInt(data.capacity) <= 0) {
      alert("Capacity must be a valid positive number.");
      return false;
    }
    return true;
  }

  function addExistingRow(id, code, capacity, type) {
    const row = document.createElement("tr");
    row.dataset.rowId = id;

    row.innerHTML = `
        <td><input type="text" value="${code}" disabled></td>
        <td><input type="number" min="0" value="${capacity}" disabled></td>
        <td>
          <select disabled>
            ${generateRoomTypeOptions(type)}
          </select>
        </td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;

    const editBtn = row.querySelector(".edit-btn");
    const deleteBtn = row.querySelector(".delete-btn");
    const inputs = row.querySelectorAll("input, select");

    editBtn.addEventListener("click", () => handleEditRow(editBtn, inputs, id));
    deleteBtn.addEventListener("click", () => handleDeleteRow(row, id));

    existingClassTableBody.appendChild(row);
  }

  function handleEditRow(editBtn, inputs, rowId) {
    if (editBtn.textContent === "Edit") {
      inputs.forEach((input) => (input.disabled = false));
      editBtn.textContent = "Save";
    } else {
      const data = {
        room_code: inputs[0].value.trim(),
        capacity: inputs[1].value.trim(),
        room_type: inputs[2].value.trim(),
      };

      if (!validateRoomData(data)) {
        inputs.forEach((input) => (input.disabled = false));
        return;
      }
      const token = localStorage.getItem("access_token");
      fetch(`${baseUrl}/updateRoom/${rowId}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(
                errorData.error || `HTTP error! Status: ${response.status}`
              );
            });
          }
          return response.json();
        })
        .then((updatedData) => {
          alert("Room updated successfully!");
          editBtn.textContent = "Edit";
          inputs.forEach((input) => (input.disabled = true));
        })
        .catch((error) => {
          console.error("Error updating room:", error);
          alert(error.message || "Failed to update room details.");
        });
    }
  }

  function handleDeleteRow(row, rowId) {
    if (confirm("Are you sure you want to delete this room?")) {
      const token = localStorage.getItem("access_token");
      fetch(`${baseUrl}/deleteRoom/${rowId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(() => {
          row.remove();
          alert("Room deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting room:", error);
          alert("Failed to delete room. Please try again.");
        });
    }
  }

  function addNewClassRow(code, capacity, type) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td><input type="text" class="class-code" value="${code}" placeholder="Enter Room Code"></td>
        <td><input type="number" min="0" class="class-capacity" value="${capacity}" placeholder="Enter Room Capacity"></td>
        <td>
          <select class="class-type">
            ${generateRoomTypeOptions(type)}
          </select>
        </td>
        <td>
          <button class="delete-btn">Delete</button>
        </td>
      `;

    const deleteBtn = row.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this entry?")) {
        row.remove();
      }
    });

    newClassTableBody.appendChild(row);
  }

  function generateRoomTypeOptions(selectedType) {
    const roomTypes = ["Lecture Theatre", "Class Room", "Lab", "Seminar Hall"];
    return roomTypes
      .map(
        (type) =>
          `<option value="${type}" ${
            type === selectedType ? "selected" : ""
          }>${type}</option>`
      )
      .join("");
  }
});
