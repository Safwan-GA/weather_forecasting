# Weather Forecast App

This is a simple and interactive weather forecast web application that allows users to check the current weather and extended forecast for any city. The app provides a search option, a current location feature using geolocation, and displays recent cities for quick access.

## Features

- **Search for Weather**: Enter the name of a city and get the current weather and a 3-day forecast.
- **Use Current Location**: Automatically fetch weather details based on the user's current location.
- **Recent Cities**: The app saves your recent city searches for easy access.
- **Dark/Light Theme**: Toggle between dark and light modes, with preferences saved in local storage.
- **Interactive Map**: Click on any location on the map to fetch the weather for that location.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Weather API**: [WeatherAPI](https://www.weatherapi.com/) (Replace with your own API key)
- **Map**: [Leaflet.js](https://leafletjs.com/)
- **Styling**: Tailwind CSS-inspired custom styles for responsive design

## How to Use

1. Clone the repository or download the HTML file to your local machine.
2. Replace the placeholder `Your_api_Key` in the JavaScript code with your own API key from [WeatherAPI](https://www.weatherapi.com/).
3. Open the `index.html` file in any modern browser.

### Search Weather
- Simply enter the name of the city in the input field and click the "Search" button.
- The app will display the current weather, temperature, humidity, wind speed, and a 3-day forecast.

### Use Current Location
- Click the "Use Current Location" button to fetch the weather based on your current geolocation.

### Recent Cities
- The app remembers the last 5 cities you've searched for and allows you to select them from a dropdown for quick access.

### Toggle Theme
- Click the "Dark" button to toggle between dark and light themes.
- The app remembers your theme choice in local storage.

### Interactive Map
- The map is centered on India by default. You can click anywhere on the map to fetch the weather of that location.
