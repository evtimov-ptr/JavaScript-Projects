"use strict";

//////////////////////////////
// Elements
const container = document.querySelector(".container");
const input = document.querySelector(".search__input");
const btn = document.querySelector(".searchBtn");
const result = document.querySelector(".result");
const final = document.querySelector(".final");
const chartContainer = document.querySelector(".chart-container");
const canvas = document.getElementById("myChart");
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
  const windSpeed = data.list[0].wind.speed;
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

  const htmlReworked = `
  <div class="weather__card">
  <div class="first__container">
    <h2 class="title__label">${data.city.name}</h2>
    <p class="date__label">${date}</p>
  </div>

  <div class="secondary-content">
    <div class="information">

      <div>
      <img class="weather__icon" src="${icon}" />
        <p class="temp__label">${temp} °C</p>
        <p class="description__label">${weatherDescription}</p>
      </div>
    </div>
  </div>

  <div class="additional-info">
    <p>Humidity: ${humidity} %</p>
    <p>Wind Speed: ${windSpeed} km/h</p>
    <p>Feels like: ${feelsLike}°</p>
  </div>
</div>

  `;

  return htmlReworked;
};

const message = function (msg, title, {}) {
  toastr.error(msg, title, {
    positionClass: "toast-top-center",
    escapeHtml: true,
  });
};

const updateChart = function (data) {
  // Create an array with the temp data
  const tempData = data.list.map((item) => item.main.temp);

  // Create an array with the dateTime labels
  const labels = data.list.map((item) => {
    const date = new Date(item.dt_txt);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  // Creating the actual chart
  const ctx = canvas.getContext("2d");
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: tempData,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          pointRadius: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          ticks: {
            beginAtZero: false,
            stepSize: 5,
          },
        },
      },
    },
  });

  // Update the chart if it already exists
  if (chartContainer.contains(canvas)) {
    chart.destroy();
    chartContainer.removeChild(canvas);
  }

  chartContainer.appendChild(canvas);
};

const getWeather = function () {
  if (input.value === "") {
    message("Please proviade a valid city name!", "Warning", {});

    return;
  }
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${input.value}&appid=${apiKey}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch weather data");
      }

      return res.json();
    })
    .then((data) => {
      const html = htmlElement(data);

      if (!weatherElement) {
        weatherElement = document.createElement("div");
        container.appendChild(weatherElement);
      }
      weatherElement.innerHTML = html;
      // updateChart(data);
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
