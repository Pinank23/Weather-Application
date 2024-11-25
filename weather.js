//"use strict";

const API = "fc9bd14bed87b3343fd4d9729b6b79b3";

const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const btnEl = document.querySelector(".btn_search");
const inputEl = document.querySelector(".input_field");

const iconsContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector(".list_content ul");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// display the day
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

// display date
let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();

dateEl.textContent = date + " " + month + " " + year;

// add event
btnEl.addEventListener("click", (e) => {
  e.preventDefault();

  // check empty value
  if (inputEl.value !== "") {
    const Search = inputEl.value;
    inputEl.value = "";
    findLocation(Search);
  } else {
    document.getElementById('result').innerHTML = 'Please Enter City Name';
    setTimeout(function() {
      document.getElementById('result').innerHTML = '';
    }, 3000); 
  }
});

const timeEl = document.querySelector(".time");

function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  timeEl.textContent = timeString;
}

updateTime();
setInterval(updateTime, 1000); // update every 1 second

function findLocation(name) {
  iconsContainer.innerHTML = "";
  dayInfoEl.innerHTML = "";
  listContentEl.innerHTML = "";

  const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
  fetch(API_URL)
    .then(response => response.json())
    .then(result => {
      console.log(result);

      if (result.cod !== "404") { 
        // display image content
        const ImageContent = displayImageContent(result);

        // display right side content
        const rightSide = rightSideContent(result);

        // forecast function
        displayForeCast(result.coord.lat, result.coord.lon);

        setTimeout(() => {
          iconsContainer.insertAdjacentHTML("afterbegin", ImageContent);
          iconsContainer.classList.add("fadeIn");
          dayInfoEl.insertAdjacentHTML("afterbegin", rightSide);
        }, 1500);
      } else {
        const message = `<h2 class="weather_temp">${result.cod}</h2>
        <h3 class="cloudtxt">${result.message}</h3>`;
        iconsContainer.insertAdjacentHTML("afterbegin", message);
      }
    })
    .catch(error => {});
}

// display image content and temp
function displayImageContent(data) {
  return `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="" />
    <h2 class="weather_temp">${Math.round(data.main.temp - 275.15)}°C</h2>
    <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

// display the right side content
function rightSideContent(result) {
  const sunrise = new Date(result.sys.sunrise * 1000);
  const sunset = new Date(result.sys.sunset * 1000);

  return `<div class="content">
          <p class="title">NAME</p>
          <span class="value">${result.name}</span>
        </div>
        <div class="content">
          <p class="title">TEMP</p>
          <span class="value">${Math.round(result.main.temp - 275.15)}°C</span>
        </div>
        <div class="content">
          <p class="title">FEELS LIKE</p>
          <span class="value">${Math.round(result.main.feels_like - 275.15)}°C</span>
        </div>
        <div class="content">
          <p class="title">HUMIDITY</p>
          <span class="value">${result.main.humidity}%</span>
        </div>
        <div class="content">
          <p class="title">WIND SPEED</p>
          <span class="value">${Math.round(result.wind.speed * 3.6)} km/h</span>
        </div>
        <div class="content">
      <p class="title">SUNRISE</p>
      <span class="value">${sunrise.toLocaleTimeString()}</span>
    </div>
    <div class="content">
      <p class="title">SUNSET</p>
      <span class="value">${sunset.toLocaleTimeString()}</span>
    </div>`; 
}

function displayForeCast(lat, long) {
    const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
    fetch(ForeCast_API)
      .then(response => response.json())
      .then(result => {
        // filter the forecast
        const uniqueDates = [...new Set(result.list.map(item => item.dt_txt.split(' ')[0]))];
  
        // Sirf 4 din ka forecast dikhane ke liye
        const fourDaysForecast = uniqueDates.slice(0, 4);
  
        fourDaysForecast.forEach(date => {
          const forecastList = result.list.filter(item => item.dt_txt.split(' ')[0] === date);
          const maxTemp = Math.max(...forecastList.map(item => item.main.temp));
          const minTemp = Math.min(...forecastList.map(item => item.main.temp));
  
          // Get the day of the week
          const dayOfWeek = new Date(date).getDay();
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const dayName = dayNames[dayOfWeek];
  
          const forecastHTML = `
            <li>
              <span class="day-name">${dayName}</span>
              <span class="max-temp">${Math.round(maxTemp - 275.15)}°C</span>
              <span class="min-temp">${Math.round(minTemp - 275.15)}°C</span>
            </li>
          `;
  
          listContentEl.insertAdjacentHTML("beforeend", forecastHTML);
        });
      })
      .catch(error => {});
  }