// HTML references 
const cityInfo = $('#city-info');
const displayCityName = $('#city-name-main');
const formEl = $('#form');
const cityInput = $('#search');


// Retreiving the recent cities searched into local storage
const recentCity = JSON.parse(localStorage.getItem('recentCity')) || [];
const recentCityEl = $('#recent-city');

for (let i = 0; i < recentCity.length; i++) {
  const button = $('<button class="btn-city">');
  button.text(recentCity[i]);
  button.on('click', function (){
    getForecast(recentCity[i]);
  })
  recentCityEl.append(button);
}

let currentCity = '';
let units = 'metric';

// Function to handle search for city
const formSubmitHandler = function (event) {
  event.preventDefault();

  currentCity = cityInput.val().trim();

  if (currentCity) {
    getForecast(currentCity);

    cityInput.val('');
    
  }
};


// Function to retrieve forecast data from API
const getForecast = function (city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=832a866a769b015f098817ad9496bc70&units=${units}`;

  fetch(apiUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    displayForecast(data);
    console.log(data)
  
  // Adding recent cities searched to localStorage
  if (!recentCity.includes(city.toLowerCase())) {
    recentCity.push(city.toLowerCase())
    localStorage.setItem('recentCity', JSON.stringify(recentCity))
    const button = $('<button class="btn-city">');
    button.text(city.toLowerCase());
    button.on('click', function (){
    getForecast(city.toLowerCase());
    })
    recentCityEl.append(button);
  }
})
}


// Function to display the forecast data 
const displayForecast = function (data) {
  const cityName = data.city.name;
  console.log(cityName)
  const forecastContainer = $('#forecast-container');
  const temperatureCelsius = data.list[0].main.temp;
  const temperatureFahrenheit = Math.floor((temperatureCelsius * 9/5) + 32);
  
  // Variables to display the weather data for current day at top of page
  const wind = data.list[0].wind.speed;
  const humidity = data.list[0].main.humidity;
  const icon = data.list[0].weather[0].icon;

  // Get the current date in the format "Day, Month Date, Year"
  const date = new Date();
  const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);

  const cityNameEl = $('#city-name-main');
  const tempEl = $('#temp');
  const windEl = $('#wind');
  const humidityEl = $('#humidity');
  
  // changing the text content for the current weather info
  cityNameEl.text(`${cityName} (${formattedDate})`);
  tempEl.text(`Temp: ${temperatureFahrenheit} F`)
  windEl.text(`Wind: ${wind} MPH`)
  humidityEl.text(`Humidity: ${humidity} %`)
  document.querySelector('.icon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`

  forecastContainer.empty();

  // creating the forecast for the next 5 days
  const currentDate = new Date();
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(currentDate.getDate() + 5);

  let uniqueDates = {};

// loop and variables to get the forecast for the next 5 days 
for (let i = 2; i < data.list.length; i+=8) {
  const forecastList = data.list;
  const forecast = forecastList[i];
  const forecastDate = new Date(forecast.dt * 1000);
  const dateKey = forecastDate.toDateString();

  if (forecastDate <= fiveDaysLater && !uniqueDates[dateKey]) {
    const date = forecastDate.toLocaleDateString();
    const tempCel = forecast.main.temp;
    const tempFahrenheit = Math.floor((tempCel * 9/5) + 32);
    const wind = forecast.wind.speed;
    const humidity = forecast.main.humidity;
    const icon = forecast.weather[0].icon;
  
    const forecastCard = $('<div class="col">');
  
    // Updating the HTML with the current 5 day forecast 
    forecastCard.html(`
    <div class="weather-info">
    <h3 class="date">${date}</h3>
    <img src='https://openweathermap.org/img/wn/${icon}@2x.png' class="icon">
      <p class="info">Temp: ${tempFahrenheit}°F</p>
      <p class="info">Wind: ${wind} MPH</p>
      <p class="info">Humidity: ${humidity}%</p>
    </div>
    
    `);
    forecastContainer.append(forecastCard);
    
  }
}
}

// event handler to submit the search results for the city input 
formEl.on('submit', formSubmitHandler);

getForecast();


