const apiKey = 'eab6e1c4cc4f47ec92e24313242910';
const weatherApiUrl = 'https://api.weatherapi.com/v1/current.json';
const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&days=5`; 
document.getElementById('searchButton').addEventListener('click', () => {
    const location = document.getElementById('locationInput').value;
    if (location) {
        fetchWeather(location);
        fetchForecast(location);
    } else {
        displayErrorMessage("Please enter a location.");
    }
});
function fetchWeather(location) {
    const url = `${weatherApiUrl}?key=${apiKey}&q=${location}&aqi=no`;
    fetch(url)
        .then(response => response.ok ? response.json() : Promise.reject("Location not found"))
        .then(data => {
            displayWeather(data);
            clearErrorMessage();
        })
        .catch(error => displayErrorMessage(error));
}
function fetchForecast(location) {
    const url = `${apiUrl}&q=${location}`;
    fetch(url)
        .then(response => response.ok ? response.json() : Promise.reject("Forecast data not found"))
        .then(data => displayForecast(data))
        .catch(error => console.error(error));
}
function displayWeather(data) {
    const locationName = `${data.location.name}, ${data.location.country}`;
    const weatherIconUrl = `https:${data.current.condition.icon}`;
    const temperature = `${data.current.temp_c}°C`;
    const windSpeed = `${data.current.wind_kph} kph`;
    const humidity = `${data.current.humidity}%`;
    const rainChance = `${data.current.cloud}%`;
    document.getElementById('location').textContent = locationName;
    document.getElementById('weatherCondition').textContent = data.current.condition.text;
    document.getElementById('weatherIcon').src = weatherIconUrl;
    document.getElementById('currentTemperature').textContent = temperature;
    document.getElementById('windSpeed').textContent = windSpeed;
    document.getElementById('humidity').textContent = humidity;
    document.getElementById('chanceOfRain').textContent = rainChance;
    const [date, time] = data.location.localtime.split(' ');
    document.getElementById('localTime').textContent = `Date: ${date} - Local Time: ${time}`;
    changeBackgroundImage(data.current.condition.text);


    const activityButton = document.getElementById('activityButton');
    activityButton.removeEventListener('click', toggleActivities);
    activityButton.addEventListener('click', () => toggleActivities(data));
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    data.forecast.forecastday.forEach(day => {
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';

        const iconUrl = `https:${day.day.condition.icon}`;

        forecastCard.innerHTML = `
            <h4>${new Date(day.date).toLocaleDateString()}</h4>
            <img src="${iconUrl}" alt="Weather Icon" class="forecast-icon">
            <p>${day.day.condition.text}</p>
            <p>Max Temp: ${day.day.maxtemp_c}°C</p>
            <p>Min Temp: ${day.day.mintemp_c}°C</p>
            <p>Chance of Rain: ${day.day.daily_chance_of_rain}%</p>
        `;

        forecastDiv.appendChild(forecastCard);
    });
}

function changeBackgroundImage(weatherDescription) {
    const body = document.body;

    body.style.backgroundImage = '';
    body.style.backgroundSize = 'cover';
    body.style.backgroundRepeat = 'no-repeat';

    const rainKeywords = ["rain", "drizzle", "thunderstorm"];
    const snowKeywords = ["snow", "sleet"];
    const sunnyKeywords = ["clear", "sunny", "few clouds"];
    const cloudyKeywords = ["clouds", "overcast"];

    if (rainKeywords.some(keyword => weatherDescription.toLowerCase().includes(keyword))) {
        body.style.backgroundImage = "url('images/rain.jpg')";
    } else if (snowKeywords.some(keyword => weatherDescription.toLowerCase().includes(keyword))) {
        body.style.backgroundImage = "url('images/snow.jpg')";
    } else if (sunnyKeywords.some(keyword => weatherDescription.toLowerCase().includes(keyword))) {
        body.style.backgroundImage = "url('images/sunny.jpg')";
    } else if (cloudyKeywords.some(keyword => weatherDescription.toLowerCase().includes(keyword))) {
        body.style.backgroundImage = "url('images/cloudy.jpg')";
    }
}



const activities = {
    hiking: { text: "Go for a hike", img: "images/hiking.jpg" },
    camping: { text: "Set up camp", img: "images/camping.jpg" },
    mountaineering: { text: "Try mountaineering", img: "images/mountaineering.jpg" },
    cycling: { text: "Go cycling", img: "images/cycling.jpg" },
    dogWalking: { text: "Walk the dog", img: "images/walking.jpg" },
    canoeing: { text: "Go canoeing", img: "images/canoeing.jpg" },
    caving: { text: "Explore a cave", img: "images/caving.jpg" },
    kayaking: { text: "Try kayaking", img: "images/kayaking.jpg" },
    rafting: { text: "Go rafting", img: "images/rafting.jpg" },
    rockClimbing: { text: "Go rock climbing", img: "images/rockclimbing.jpg" },
    running: { text: "Go for a run", img: "images/running.jpg" },
    sailing: { text: "Go sailing", img: "images/sailing.jpg" },
    skiing: { text: "Hit the slopes", img: "images/skiing.jpg" },
    skydiving: { text: "Try skydiving", img: "images/skydiving.jpg" },
    surfing: { text: "Go surfing", img: "images/surfing.jpg" },
    fishing: { text: "Go fishing", img: "images/fishing.jpg" },
    picnicking: { text: "Have a picnic", img: "images/picnic.jpg" },
    geocaching: { text: "Try geocaching", img: "images/geocache.jpg" },
    birdWatching: { text: "Go bird watching", img: "images/birdwatching.jpg" },
    photography: { text: "Take some outdoor photos", img: "images/photography.jpg" },
    trailRunning: { text: "Try trail running", img: "images/trail.jpg" },
    beachVolleyball: { text: "Play beach volleyball", img: "images/beach.jpg" },
    stayIndoors: { text: "It's raining or too hot, stay indoors!", img: "images/indoor.jpg" }
};

function toggleActivities(data) {
    const activityContainer = document.getElementById('activityRecommendations');
    if (activityContainer.style.display === 'none') {
        activityContainer.style.display = 'flex';
        
        const temp = data.current.temp_c;
        const weatherCondition = data.current.condition.text.toLowerCase(); 
        const activitiesList = determineActivities(temp, weatherCondition);
        displayActivities(activitiesList);
    } else {
        activityContainer.style.display = 'none';
    }
}

function determineActivities(temp, weatherCondition) {
    const suitableActivities = [];

    if (temp > 35 || weatherCondition.includes("rain")) {
        suitableActivities.push(activities.stayIndoors);
    } else {
        if (temp >= 15 && temp <= 25 && !weatherCondition.includes("rain")) {
            suitableActivities.push(activities.hiking);
        }
        if (temp >= 10 && temp <= 20 && !weatherCondition.includes("rain")) {
            suitableActivities.push(activities.camping);
        }
        if (temp <= 10 && !weatherCondition.includes("rain")) {
            suitableActivities.push(activities.mountaineering);
        }
        if (temp >= 15 && temp <= 25 && !weatherCondition.includes("rain")) {
            suitableActivities.push(activities.cycling);
        }
        if (temp >= 5 && temp <= 20 && !weatherCondition.includes("rain")) {
            suitableActivities.push(activities.dogWalking);
        }
        if (temp >= 20 && temp <= 30 && !weatherCondition.includes("rain")) {
            suitableActivities.push(activities.canoeing);
        }
        if (temp >= 15 && !weatherCondition.includes("rain")) {
            suitableActivities.push(activities.fishing);
        }
        if (temp >= 10 && !weatherCondition.includes("rain")) {
            suitableActivities.push(activities.picnicking);
        }
        if (temp >= 15 && !weatherCondition.includes("rain")) {
            suitableActivities.push(activities.birdWatching);
        }
        if (temp >= 20 && !weatherCondition.includes("rain")) {
            suitableActivities.push(activities.photography);
        }
        if (temp >= 5 && !weatherCondition.includes("rain")) {
            suitableActivities.push(activities.trailRunning);
        }
        if (temp >= 20 && !weatherCondition.includes("rain")) {
            suitableActivities.push(activities.beachVolleyball);
        }
    }

    return suitableActivities;
}

function displayActivities(activitiesList) {
    const activityContainer = document.getElementById('activityRecommendations');
    activityContainer.innerHTML = ''; 

    activitiesList.forEach(activity => {
        const activityCard = document.createElement('div');
        activityCard.className = 'activity-card';
        activityCard.innerHTML = `
            <img src="${activity.img}" alt="${activity.text}" class="activity-image">
            <p>${activity.text}</p>
        `;
        activityContainer.appendChild(activityCard);
    });
}

function displayErrorMessage(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block'; 
}

function clearErrorMessage() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '';
    errorMessage.style.display = 'none'; 
}
