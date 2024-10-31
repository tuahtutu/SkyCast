let activities = [];

// Function to fetch weather forecast for a given date and location
async function fetchWeatherForecast(date, location) {
    const apiKey = '615ac3218d20036d72c80ae0da2d225e';
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(forecastUrl);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();

        if (!data.list) {
            throw new Error("No forecast data available for this city.");
        }

        // Find the forecast closest to the requested date
        const forecastForDate = data.list.find((entry) => entry.dt_txt.startsWith(date));
        
        if (forecastForDate) {
            return {
                condition: forecastForDate.weather[0].description,
                avgTemp: forecastForDate.main.temp,
                icon: forecastForDate.weather[0].icon 
            };
        } else {
            return { condition: 'No forecast available', avgTemp: 'N/A', icon: '' };
        }

    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        return { condition: 'Error fetching data', avgTemp: 'N/A', icon: '' };
    }
}

// Function to add or update activity
document.getElementById('activityForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('activityTitle').value;
    const description = document.getElementById('activityDescription').value;
    const date = document.getElementById('activityDate').value;
    const location = document.getElementById('activityLocation').value;

    // Fetch weather for the activity
    const weather = await fetchWeatherForecast(date, location);

    // Check if updating or adding a new activity
    if (document.getElementById('activityForm').dataset.isUpdating === "true") {
        const updateIndex = document.getElementById('activityForm').dataset.updateIndex;
        activities[updateIndex] = { title, description, date, location, weather };
    } else {
        
        activities.push({ title, description, date, location, weather });
    }

    renderActivities();
    document.getElementById('activityForm').reset();
    document.getElementById('activityForm').removeAttribute("data-is-updating");
    saveActivities(); 
});

// Function to display all created activities
function renderActivities() {
    const container = document.getElementById('activitiesContainer');
    container.innerHTML = '';

    activities.forEach((activity, index) => {
        const activityCard = document.createElement('div');
        activityCard.classList.add('activity-card');
        activityCard.innerHTML = `
            <h3>${activity.title}</h3>
            <p>${activity.description}</p>
            <p><strong>Date:</strong> ${activity.date}</p>
            <p><strong>Location:</strong> ${activity.location}</p>
            <p><strong>Weather Forecast:</strong> <span class="weather-icon"><img src="http://openweathermap.org/img/wn/${activity.weather.icon}.png" alt="Weather icon"></span>${activity.weather.condition}, ${activity.weather.avgTemp}°C</p>
            <button class="update-btn" onclick="editActivity(${index})">Edit</button>
            <button class="delete-btn" onclick="deleteActivity(${index})">Delete</button>
            <button class="checklist-btn" onclick="goToChecklist(${index})">Add Equipment</button>
        `;
        container.appendChild(activityCard);
    });
}


// navigate the user to a checklist page for a specific activity
function goToChecklist(index) {
    const activity = activities[index];
    window.location.href = `checklist.html?activityTitle=${encodeURIComponent(activity.title)}`;
}

// Function to edit an activity
function editActivity(index) {
    const activity = activities[index];
    document.getElementById('activityTitle').value = activity.title;
    document.getElementById('activityDescription').value = activity.description;
    document.getElementById('activityDate').value = activity.date;
    document.getElementById('activityLocation').value = activity.location;
    
    // Set form to updating state
    document.getElementById('activityForm').dataset.isUpdating = "true";
    document.getElementById('activityForm').dataset.updateIndex = index; 
}

// Function to delete an activity
function deleteActivity(index) {
    activities.splice(index, 1);
    renderActivities();
    saveActivities(); // Update local storage after deletion
}

// Function to save activities to local storage
function saveActivities() {
    localStorage.setItem('activities', JSON.stringify(activities));
}

// restores the saved state of the checklist whenever the page is opened, enabling persistent data storage across sessions.
function loadActivities() {
    const savedActivities = localStorage.getItem('activities');
    if (savedActivities) {
        activities = JSON.parse(savedActivities);
        renderActivities();
    }
}


window.onload = loadActivities;
