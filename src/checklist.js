let equipmentList = [];

// Get the activity title from activities.html
const params = new URLSearchParams(window.location.search);
const activityTitle = params.get('activityTitle');
document.getElementById('activityTitleDisplay').textContent = activityTitle;


let editIndex = null;

document.getElementById('checklistForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const equipmentName = document.getElementById('equipmentName').value;
    const equipmentDescription = document.getElementById('equipmentDescription').value;

    if (editIndex !== null) {
        equipmentList[editIndex] = {
            name: equipmentName,
            description: equipmentDescription,
            completed: equipmentList[editIndex].completed || false
        };
        editIndex = null;
    } else {
        equipmentList.push({ name: equipmentName, description: equipmentDescription, completed: false });
    }

    renderChecklist();
    document.getElementById('checklistForm').reset();
    saveChecklist();
});

//This is for displaying the equipment that already been created
function renderChecklist() {
    const container = document.getElementById('checklistItemsContainer');
    container.innerHTML = '';

    equipmentList.forEach((item, index) => {
        const checklistItem = document.createElement('div');
        checklistItem.classList.add('checklist-item');
        if (item.completed) checklistItem.classList.add('completed');

        checklistItem.innerHTML = `
            <label>
                <input type="checkbox" ${item.completed ? 'checked' : ''} onclick="toggleCompleted(${index})">
                <span>
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                </span>
            </label>
            <button class="update-btn" onclick="editEquipment(${index})">Update</button>
            <button class="delete-btn" onclick="deleteEquipment(${index})">Delete</button>
        `;

        container.appendChild(checklistItem);
    });
}


function toggleCompleted(index) {
    equipmentList[index].completed = !equipmentList[index].completed;
    renderChecklist();
    saveChecklist();
}

// Function to delete equipment from the checklist
function deleteEquipment(index) {
    equipmentList.splice(index, 1);
    renderChecklist();
    saveChecklist();
}

// Function to edit equipment
function editEquipment(index) {
    editIndex = index;
    document.getElementById('equipmentName').value = equipmentList[index].name;
    document.getElementById('equipmentDescription').value = equipmentList[index].description;
}

// Function to save checklist to local storage
function saveChecklist() {
    localStorage.setItem('checklist_' + activityTitle, JSON.stringify(equipmentList));
}

// restores the saved state of the checklist whenever the page is opened, enabling persistent data storage across sessions.
function loadChecklist() {
    const savedChecklist = localStorage.getItem('checklist_' + activityTitle);
    if (savedChecklist) {
        equipmentList = JSON.parse(savedChecklist);
        renderChecklist();
    }
}
window.onload = loadChecklist;
