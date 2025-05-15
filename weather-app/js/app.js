document.getElementById('searchBtn').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value.trim();
  const display = document.getElementById('weatherDisplay');

  if (!city) {
    display.innerHTML = `<p class="text-red-600">Please enter a city name.</p>`;
    return;
  }

  display.innerHTML = `<p>Loading weather for <strong>${city}</strong>...</p>`;

  // Replace with actual API fetch


  setTimeout(() => {
    display.innerHTML = `<p>Weather for <strong>${city}</strong>: Sunny, 25°C</p>`;
  }, 1000);
});




const API_KEY = 'b46c24f4d290aae77f60cf23bb9c4860'; // 🔐 Replace with your OpenWeatherMap API key

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const display = document.getElementById('weatherDisplay');

// Utility: Convert Kelvin to Celsius
const kelvinToCelsius = (k) => (k - 273.15).toFixed(1);

// Get Weather Data
const getWeatherData = async (city) => {
  try {
    display.innerHTML = `<p class="text-gray-700">Loading weather for <strong>${city}</strong>...</p>`;

    const currentWeatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );

    if (!currentWeatherRes.ok) {
      throw new Error('City not found.');
    }

    const currentWeather = await currentWeatherRes.json();

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
    );

    if (!forecastRes.ok) {
      throw new Error('Forecast not available.');
    }

    const forecast = await forecastRes.json();

    renderWeather(currentWeather, forecast);
  } catch (err) {
    display.innerHTML = `<p class="text-red-600 font-semibold">${err.message}</p>`;
  }
};

// Render Data
const renderWeather = (current, forecast) => {
  const { name, main, weather, wind } = current;
  const icon = weather[0].icon;
  const temp = kelvinToCelsius(main.temp);
  const desc = weather[0].description;

  let html = `
    <div class="bg-blue-100 p-4 rounded-lg shadow mb-4">
      <h2 class="text-xl font-bold mb-2">${name}</h2>
      <div class="flex items-center gap-4">
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
        <div>
          <p class="text-lg">${desc}</p>
          <p class="text-2xl font-semibold">${temp}°C</p>
          <p>Humidity: ${main.humidity}% | Wind: ${wind.speed} m/s</p>
        </div>
      </div>
    </div>
    <h3 class="text-lg font-bold mb-2">5-Day Forecast</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  `;

  // Filter forecast: one per day at 12:00 PM
  const daily = forecast.list.filter(item => item.dt_txt.includes('12:00:00'));
  daily.forEach(item => {
    const date = new Date(item.dt_txt).toLocaleDateString();
    const dayIcon = item.weather[0].icon;
    const dayDesc = item.weather[0].description;
    const dayTemp = kelvinToCelsius(item.main.temp);

    html += `
      <div class="bg-white p-4 rounded shadow">
        <p class="font-semibold">${date}</p>
        <img src="https://openweathermap.org/img/wn/${dayIcon}@2x.png" alt="${dayDesc}" class="w-12">
        <p>${dayDesc}</p>
        <p><strong>${dayTemp}°C</strong></p>
        <p>Wind: ${item.wind.speed} m/s | Humidity: ${item.main.humidity}%</p>
      </div>
    `;
  });

  html += '</div>';
  display.innerHTML = html;
};

// Event Listener
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (!city) {
    display.innerHTML = `<p class="text-red-600">Please enter a city name.</p>`;
    return;
  }
  getWeatherData(city);
});


