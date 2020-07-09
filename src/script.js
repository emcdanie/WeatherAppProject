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

// data funcitons
function displayWeatherCondition(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
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
}

let iconElement = document.querySelector("#icon");

//links
function displayFahrenheitConversions(event) {
  function displayFahrenheitTemp(event) {
    event.preventDefault();
    let temperature = document.querySelector("#temperature");
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
    let fahrTemp = (celsTemp * 9) / 5 + 32;
    temperature.innerHTML = Math.round(fahrTemp);
  }
  displayFahrenheitTemp(event);

  function displayForecastFahrTemp(event) {
    event.preventDefault();
    let forecastTemp = document.querySelectorAll("#forecast-cels-temp");
    forecastTemp.forEach((forecast) => {
      let forecastValue = forecast.innerHTML;
      forecast.innerHTML = Math.round((forecastValue * 9) / 5 + 32);
    });
  }
  displayForecastFahrTemp(event);
  fahrenheitLink.removeEventListener("click", displayFahrenheitConversions);
  celsiusLink.addEventListener("click", displayCelsiusConversions);
}

function displayCelsiusConversions(event) {
  function displayCelsiusTemp(event) {
    event.preventDefault();
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
    let temperature = document.querySelector("#temperature");
    temperature.innerHTML = Math.round(celsTemp);
  }
  displayCelsiusTemp(event);

  function displayForecastCelsTemp(event) {
    event.preventDefault();
    let forecastTemp = document.querySelectorAll("#forecast-cels-temp");
    forecastTemp.forEach((forecast) => {
      let forecastValue = forecast.innerHTML;
      forecast.innerHTML = Math.round(((forecastValue - 32) * 5) / 9);
    });
  }
  displayForecastCelsTemp(event);
  celsiusLink.removeEventListener("click", displayCelsiusConversions);
  fahrenheitLink.addEventListener("click", displayFahrenheitConversions);
}

let celsTemp = 0;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitConversions);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusConversions);

//sunset and sunrise hours

function UTCtoTwentyFourHours(timeZone, time) {
  let newTime = (time + timeZone) * 1000;
  let convertedDate = new Date(newTime);
  let convertedHrs = convertedDate.getUTCHours().toString().padStart(2, "0");
  let convertedMins = convertedDate.getUTCMinutes().toString().padStart(2, "0");
  let returnedString = convertedHrs + ":" + convertedMins;
  return returnedString;
}

searchCity("Paris,France");
