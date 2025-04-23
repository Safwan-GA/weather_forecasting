// Constants

document.addEventListener('DOMContentLoaded', () => {

    const apiKey = 'Your_api_Key'; // Replace 'your-api-key' with your actual API key from OpenWeatherMap or another provider
    const weatherApiUrl = 'https://api.weatherapi.com/v1/';
    const recentCitiesKey = 'recentCities';
    const forecastDayNumber=4; //always put forecastDayNumber + 1, since it will todays forecast also.

    // DOM Elements
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const currentLocationBtn = document.getElementById('current-location-btn');
    const recentCitiesDropdown = document.getElementById('recent-cities');
    const currentWeatherSection = document.getElementById('current-weather');
    const currentCity = document.getElementById('current-city');
    const currentTemperature = document.getElementById('current-temperature');
    const currentDescription = document.getElementById('current-description');
    const currentHumidity = document.getElementById('current-humidity');
    const currentWind = document.getElementById('current-wind');
    const currentWeatherIcon = document.getElementById('current-weather-icon');
    const forecastGrid = document.getElementById('forecast-grid');
    const forecastDayInfo=document.getElementById('forecast-day-info')

    forecastDayInfo.textContent=`${forecastDayNumber-1} - Day Forecast`
    const themeToggleBtn = document.getElementById("themeToggle");

    // On button click
    themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    // Persist theme in localStorage
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("preferredTheme", isDark ? "dark" : "light");

    // Update label (if using a span inside the button)
    const label = document.getElementById("toggleLabel");
    if (label) label.textContent = isDark ? "Light" : "Dark";
    });

    // On page load, apply saved theme
    const savedTheme = localStorage.getItem("preferredTheme");
    if (savedTheme === "dark") {
    document.body.classList.add("dark");
    const label = document.getElementById("toggleLabel");
    if (label) label.textContent = "Light";
    }


    // Event Listeners
    searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeatherByCity(city.trim());
        addCityToRecent(city.trim());
    } else {
        alert('Since the city name is empty, we will use the current location as the city to proceed.');
        fetchWeatherByCurrentCity();
    }
    });

    function fetchWeatherByCurrentCity(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoordinates(latitude, longitude);
            },
            () => alert('Unable to retrieve your location.')
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    }

    currentLocationBtn.addEventListener('click', fetchWeatherByCurrentCity);

    recentCitiesDropdown.addEventListener('change', (e) => {
    const selectedCity = e.target.value;
    if (selectedCity) {
        fetchWeatherByCity(selectedCity);
    }
    });

    // Functions
    function fetchWeatherByCity(city) {
    const url = `${weatherApiUrl}current.json?key=${apiKey}&q=${city}`;
    fetchWeather(url, city);
    }

    function fetchWeatherByCoordinates(lat, lon) {
    const url = `${weatherApiUrl}current.json?key=${apiKey}&q=${lat},${lon}`;
    fetchWeather(url);
    }



    function fetchWeather(url, city) {
    fetch(url)
        .then((response) => {
        if (!response.ok) {
            throw new Error('City not found or API error.');
        }
        return response.json();
        })
        .then((data) => {
        displayCurrentWeather(data);
        if (city) {
            fetchExtendedForecast(city);
        } else {
            // const locationName = city || data.location?.name;
            fetchExtendedForecast(data.location?.name);
        }
        })
        .catch((error) => alert(error.message));
    }

    function fetchExtendedForecast(city) {
    //   const url = `${weatherApiUrl}/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const url = `${weatherApiUrl}forecast.json?key=${apiKey}&q=${city}&days=${forecastDayNumber}`;
    fetch(url)
        .then((response) => {
        if (!response.ok) {
            throw new Error('Unable to fetch extended forecast.');
        }
        return response.json();
        })
        .then((data) => displayExtendedForecast(data))
        .catch((error) => alert(error.message));
    }

    function displayCurrentWeather(data) {
    currentCity.textContent = data.name;
    //   currentTemperature.textContent = `${Math.round(data.main.temp)}°C`;
    //   currentDescription.textContent = data.weather[0].description;
    //   currentHumidity.textContent = `Humidity: ${data.main.humidity}%`;
    //   currentWind.textContent = `Wind Speed: ${data.wind.speed} km/h`;
    //   currentWeatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    currentCity.textContent = data.location.name;
    currentTemperature.textContent = `${Math.round(data.current.temp_c)}°C`;
    currentDescription.textContent = data.current.condition.text;
    currentHumidity.textContent = `Humidity: ${data.current.humidity}%`;
    currentWind.textContent = `Wind Speed: ${data.current.wind_kph} km/h`;
    currentWeatherIcon.src = data.current.condition.icon;
    }
    function displayExtendedForecast(data) {
        forecastGrid.innerHTML = ''; // Clear previous forecast cards
    
        const dailyForecasts = data.forecast.forecastday.slice(1);
    
        dailyForecasts.forEach((forecast) => {
        const forecastCard = document.createElement('div');
        forecastCard.className =
            'bg-blue-100 p-4 rounded-lg shadow-md flex flex-col items-center';
    
        const date = forecast.date;
        const temp = `${Math.round(forecast.day.avgtemp_c)}°C`;
        const wind = `Wind: ${forecast.day.maxwind_kph} km/h`;
        const humidity = `Humidity: ${forecast.day.avghumidity}%`;
        const iconUrl = forecast.day.condition.icon;
    
        forecastCard.innerHTML = `
            <p class="text-lg font-bold">${date}</p>
            <img src="${iconUrl}" alt="Weather Icon" class="w-16 h-16">
            <p>${temp}</p>
            <p>${wind}</p>
            <p>${humidity}</p>
        `;
    
        forecastGrid.appendChild(forecastCard);
        });
    }
    const map = L.map('map').setView([20.5937, 78.9629], 5); // Centered on India

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // On map click, fetch weather using lat/lon
    map.on('click', function (e) {
        const { lat, lng } = e.latlng;
        fetchWeatherByCoordinates(lat, lng); 
      });
    map.on('mousemove', function (e) {
    const { lat, lng } = e.latlng;
    map.getContainer().style.cursor = 'pointer';  // Change cursor to pointer on hover
    });
      

    
    // function displayExtendedForecast(data) {
    //   forecastGrid.innerHTML = ''; // Clear previous forecast cards

    //   // Extract forecast data for every 8th interval (24-hour forecast)
    //   const dailyForecasts = data.list.filter((_, index) => index % 8 === 0);

    //   dailyForecasts.forEach((forecast) => {
    //     const forecastCard = document.createElement('div');
    //     forecastCard.className =
    //       'bg-blue-100 p-4 rounded-lg shadow-md flex flex-col items-center';

    //     // const date = new Date(forecast.dt * 1000).toLocaleDateString();
    //     // const temp = `${Math.round(forecast.main.temp)}°C`;
    //     // const wind = `Wind: ${forecast.wind.speed} km/h`;
    //     // const humidity = `Humidity: ${forecast.main.humidity}%`;
    //     // const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
    //     const date = forecast.date;
    //     const temp = `${Math.round(forecast.day.avgtemp_c)}°C`;
    //     const wind = `Wind: ${forecast.day.maxwind_kph} km/h`;
    //     const humidity = `Humidity: ${forecast.day.avghumidity}%`;
    //     const iconUrl = forecast.day.condition.icon;

    //     forecastCard.innerHTML = `
    //       <p class="text-lg font-bold">${date}</p>
    //       <img src="${iconUrl}" alt="Weather Icon" class="w-16 h-16">
    //       <p>${temp}</p>
    //       <p>${wind}</p>
    //       <p>${humidity}</p>
    //     `;

    //     forecastGrid.appendChild(forecastCard);
    //   });
    // }

    // function addCityToRecent(city) {
    //   let recentCities = JSON.parse(localStorage.getItem(recentCitiesKey)) || [];
    //   if (!recentCities.includes(city)) {
    //     recentCities.push(city);
    //     localStorage.setItem(recentCitiesKey, JSON.stringify(recentCities));
    //     updateRecentCitiesDropdown();
    //   }
    // }

    function addCityToRecent(city) {
        let recentCities = JSON.parse(localStorage.getItem(recentCitiesKey)) || [];
    
        // Remove if it already exists
        recentCities = recentCities.filter(c => c.toLowerCase() !== city.toLowerCase());
    
        // Add to front
        recentCities.unshift(city);
    
        // Keep only the latest 5
        recentCities = recentCities.slice(0, 5);
    
        localStorage.setItem(recentCitiesKey, JSON.stringify(recentCities));
    }
    function showRecentDropdown() {
        const recentCities = JSON.parse(localStorage.getItem(recentCitiesKey)) || [];
        recentDropdown.innerHTML = '';
    
        if (recentCities.length === 0) {
        recentDropdown.classList.add('hidden');
        return;
        }
    
        recentCities.forEach(city => {
        const item = document.createElement('div');
        item.className = 'px-4 py-2 hover:bg-blue-100 cursor-pointer';
        item.textContent = city;
        item.addEventListener('click', () => {
            cityInput.value = city;
            fetchWeatherByCity(city);
            recentDropdown.classList.add('hidden');
        });
        recentDropdown.appendChild(item);
        });
    
        recentDropdown.classList.remove('hidden');
    }
        

    function updateRecentCitiesDropdown() {
    const recentCities = JSON.parse(localStorage.getItem(recentCitiesKey)) || [];
    recentCitiesDropdown.innerHTML = `<option value="" disabled selected>Select a city</option>`;
    recentCities.forEach((city) => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        recentCitiesDropdown.appendChild(option);
    });
    }

    // Initialization
    function init() {
    updateRecentCitiesDropdown();
    }

    // Run initialization
    init();
})