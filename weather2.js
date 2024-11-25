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

async function findLocation(name) {
    iconsContainer.innerHTML = "";
    dayInfoEl.innerHTML = "";
    listContentEl.innerHTML = "";
    try {
      const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
      const data = await fetch(API_URL);
      const result = await data.json();
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
    } catch (error) {}
  }

// display image content and temp
function displayImageContent(data) {
  return `<img src="https://openweathermap.org/img/wn/${
    data.weather[0].icon
  }@4x.png" alt="" />
    <h2 class="weather_temp">${Math.round(data.main.temp - 275.15)}°C</h2>
    <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

// display the right side content
function rightSideContent(result) {
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
        </div> `; 

}

async function displayForeCast(lat, long) {
    const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
    const data = await fetch(ForeCast_API);
    const result = await data.json();
    // filter the forecast
    const uniqeForeCastDays = [];
    const daysForecast = result.list.filter((forecast) => {
      const forecastDate = new Date(forecast.dt_txt).getDate();
      if (!uniqeForeCastDays.includes(forecastDate)) {
        return uniqeForeCastDays.push(forecastDate);
      }
    });
    console.log(daysForecast);
  
    daysForecast.forEach((content, indx) => {
      if (indx <= 3) {
        listContentEl.insertAdjacentHTML("afterbegin", forecast(content));
      }
    });
  }

// forecast html element data
function forecast(frContent) {
  const day = new Date(frContent.dt_txt);
  const dayName = days[day.getDay()];
  const splitDay = dayName.split("", 3);
  const joinDay = splitDay.join("");

  // console.log(dayName);

  return `<li>
  <img src="https://openweathermap.org/img/wn/${
    frContent.weather[0].icon
  }@2x.png" />
  <span>${joinDay}</span>
  <span class="day_temp">${Math.round(frContent.main.temp - 275.15)}°C</span>
</li>`;
}

// Add a class to the wrapper element and image section after JavaScript loads
// document.addEventListener("DOMContentLoaded", function() {
//   const wrapper = document.querySelector(".wrapper");
//   const imgSection = document.querySelector(".img_section");
//   wrapper.classList.add("js-loaded");
//   imgSection.classList.add("js-loaded");
// });