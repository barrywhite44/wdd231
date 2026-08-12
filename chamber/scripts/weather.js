document.addEventListener('DOMContentLoaded', () => {
    const currentWeather = document.getElementById('current-weather');
    const forecastContainer = document.getElementById('forecast');
    const apiKey = '019051a93d167cced4a106c06867004c';
    const lat = 7.1516;
    const lon = 3.3486;

    async function getWeather() {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
            if (!response.ok) throw new Error('Weather request failed');
            const data = await response.json();
            currentWeather.innerHTML = `<p><strong>${Math.round(data.main.temp)}°C</strong> — ${data.weather[0].description}</p>`;
        } catch (error) {
            currentWeather.textContent = 'Current weather is unavailable right now.';
            console.error(error);
        }
    }

    async function getForecast() {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
            if (!response.ok) throw new Error('Forecast request failed');
            const data = await response.json();
            const daily = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);
            forecastContainer.innerHTML = daily.map(item => `<p><strong>${new Date(item.dt_txt).toLocaleDateString(undefined, { weekday: 'short' })}</strong>: ${Math.round(item.main.temp)}°C, ${item.weather[0].description}</p>`).join('');
        } catch (error) {
            forecastContainer.textContent = 'Forecast is unavailable right now.';
            console.error(error);
        }
    }

    getWeather();
    getForecast();
});
