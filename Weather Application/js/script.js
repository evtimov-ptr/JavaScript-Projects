"use strict";

//////////////////////////////
// Elements
const container = document.querySelector(".container");
const input = document.querySelector(".search__input");
const btn = document.querySelector(".searchBtn");
const result = document.querySelector(".result");

//////////////////////////////
// API
const apiKey = "";
let weatherElement = null;

const htmlElement = function (data) {
  result.textContent = "";
  const temp = Math.round(data.list[0].main.temp - 273.15);
  const feelsLike = Math.round(data.list[0].main.feels_like - 273.15);
  const icon = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png `;
  const humidity = data.list[0].main.humidity;
  const weatherDescription = data.list[0].weather[0].main;
  const locale = "bg-BG";
  const now = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };

  const date = new Intl.DateTimeFormat(locale, options).format(now);

  const html = `
  <div class="Card">
    <div class="card__items">
      <h2>${data.city.name}</h2> 
      <p>As of ${date}</p>
      <img src=${icon}.png />
       <span class="weather__temp">${temp} °C</span>
      <p class="weather__desc"> ${weatherDescription}</p>

      <p class="thin">Humidity: ${humidity} %
      <p>Feels like: ${feelsLike}°</p>
    </div>
  </div>
  `;

  return html;
};

const getWeather = function () {
  if (input.value === "") {
    toastr.error("Please provide a valid city name!", "Warning!", {
      positionClass: "toast-top-center",
      escapeHtml: true,
    });
    return;
  }
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${input.value}&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      const html = htmlElement(data);
      if (!weatherElement) {
        weatherElement = document.createElement("div");
        container.appendChild(weatherElement);
      }
      weatherElement.innerHTML = html;
      // container.insertAdjacentHTML("beforeend", html);
    })
    .catch((error) =>
      toastr.error(error, "Warning!", {
        positionClass: "toast-top-center",
      })
    );
};

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    getWeather();
  }
});

btn.addEventListener("click", function (e) {
  e.preventDefault();
  getWeather();
});
