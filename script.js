const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key

async function getWeather() {
  const city = document.getElementById('cityInput').value;
  const weatherResult = document.getElementById('weatherResult');
  const forecastContainer = document.getElementById('forecast');

  if (!city) {
    alert('Please enter a city or zip code');
    return;
  }

  try {
    // Current weather data
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!weatherRes.ok) throw new Error("City not found");
    const weatherData = await weatherRes.json();

    // Display current weather
    const { name, main, weather, wind } = weatherData;
    weatherResult.innerHTML = `
      <h2>${name}</h2>
      <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="icon" />
      <p><strong>Temperature:</strong> ${main.temp}°C</p>
      <p><strong>Humidity:</strong> ${main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
    `;

    // 5-day forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecastRes.json();

    forecastContainer.innerHTML = '<h3>5-Day Forecast</h3>';
    const forecastList = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));

    forecastList.forEach(day => {
      forecastContainer.innerHTML += `
        <div class="forecast-day">
          <h4>${new Date(day.dt_txt).toLocaleDateString()}</h4>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="icon" />
          <p>${day.main.temp}°C</p>
        </div>
      `;
    });

  } catch (error) {
    weatherResult.innerHTML = `<p style="color:red;">${error.message}</p>`;
    forecastContainer.innerHTML = '';
  }
}
