let apiCelsiusTemp;

function formatDate() {
  let date = new Date();
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Nov",
    "Dec",
  ];

  let currentMonth = month[date.getMonth()];
  let currentYear = date.getFullYear();
  let currentDay = days[date.getDay()];
  let currentDate = date.getDate();

  return `${currentDay} ${currentMonth} ${currentDate}, ${currentYear} | Time ${hours}:${minutes}`;
}
let currentTime = document.querySelector("#current-time");
currentTime.innerHTML = formatDate();

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

//current button search
function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let CurrentLocationButton = document.querySelector("#current-location-button");
CurrentLocationButton.addEventListener("click", getCurrentLocation);

//citysearch
let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", handleSubmit);

//city Search
function searchCity(city, units) {
  let apiKey = "717c122d03da5b502d476732c8793a31";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

//hourly forecast
function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    let forecast = response.data.list[index];
    let prettyIcons = weatherIcons(forecast.weather[0].icon);
    forecastElement.innerHTML += `   
  <div class="col-2">
  <h3>
  ${formatHours(forecast.dt * 1000)}
  </h3>
  <img 
  src = ${prettyIcons}
/>
  <div class="weather-forecast-temperature">
  <strong>${Math.round(forecast.main.temp_max)}° |  </strong>${Math.round(
      forecast.main.temp_min
    )}°
</div>
</div>
`;
  }
}

function handleSubmit(event) {
  let city = document.querySelector("#city-input").value;
  event.preventDefault();
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "717c122d03da5b502d476732c8793a31";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let fahrenheitTemp = (apiCelsiusTemp * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
  console.log("displayFarhenheitTemperature");
}

function displayCelsiusTemp(event) {
  event.preventDefault();
  let celsiusTemp = apiCelsiusTemp;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
  console.log("displayCelsiusTemp");
}

// data funcitons
function displayWeatherCondition(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );

  apiCelsiusTemp = response.data.main.temp;

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#feels-like").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#status").innerHTML = response.data.weather[0].main;
  document.querySelector("#sunrise").innerHTML = UTCtoTwentyFourHours(
    response.data.timezone,
    response.data.sys.sunrise
  );

  document.querySelector("#sunset").innerHTML = UTCtoTwentyFourHours(
    response.data.timezone,
    response.data.sys.sunset
  );

  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  let prettyIcons = weatherIcons(response.data.weather[0].icon);

  iconElement.setAttribute("src", prettyIcons);
}
let iconElement = document.querySelector("#icon");
let iconSrc = "";

function weatherIcons(icon) {
  if (icon === "01d") {
    iconSrc = "src/images/sun.svg";
  } else if (icon === "02d") {
    iconSrc = "src/images/sun&cloud.svg";
  } else if (icon === "03d" || icon === "03n") {
    iconSrc = "src/images/clouds.svg";
  } else if (icon === "04d") {
    iconSrc = "src/images/clouds.svg";
  } else if (icon === "09d") {
    iconSrc = "src/images/rain.svg";
  } else if (icon === "10d" || icon === "10n") {
    iconSrc = "src/images/suncloudrain.png";
  } else if (icon === "11d" || icon === "11n") {
    iconSrc = "src/images/rainwlightning.svg";
  } else if (icon === "13d" || icon === "13n") {
    iconSrc = "src/images/snow.png";
  } else if (icon === "50d" || icon === "50n") {
    iconSrc = "src/images/smog.png";
  } else if (icon === "01n") {
    iconSrc = "src/images/moon.png";
  } else if (icon === "02n") {
    iconSrc = "src/images/cloud&moon.png";
  } else if (icon === "04n") {
    iconSrc = "src/images/clouds.svg";
  } else if (icon === "09d") {
    iconSrc = "src/images/suncloudrain.png";
  } else {
    iconSrc = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  }
  return iconSrc;
}
//sunset and sunrise hours

function UTCtoTwentyFourHours(timeZone, time) {
  let newTime = (time + timeZone) * 1000;
  let convertedDate = new Date(newTime);
  let convertedHrs = convertedDate.getUTCHours().toString().padStart(2, "0");
  let convertedMins = convertedDate.getUTCMinutes().toString().padStart(2, "0");
  let returnedString = convertedHrs + ":" + convertedMins;
  return returnedString;
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);

//serachclimatechange

searchCity("Paris,France");
