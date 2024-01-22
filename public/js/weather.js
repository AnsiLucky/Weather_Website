function setDefaultWeather() {
    const defaultCity = 'London';
    document.getElementById('cityInput').value = defaultCity;
    getWeather();
}

async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    getCurrentWeather(city);
    getExtendedForecast(city);
    getCity(city);
    document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${city}')`;
}

async function getCurrentWeather(city) {
    const currentWeatherResult = document.getElementById('currentWeatherContent');
    let currentWeatherData;

    await fetch(`/current?city=${city}`)
        .then((response) => response.json())
        .then((data) => currentWeatherData = data)
        .catch((error) => currentWeatherResult.innerHTML = `<p class="text-danger">Error: ${error}</p>`)

    const { location, current } = currentWeatherData;
    console.log(currentWeatherData);

    currentWeatherResult.innerHTML = `
            <div class="col-md-6">
                <p><strong>Location:</strong> ${location.name}, ${location.region}, ${location.country}</p>
                <p><strong>Temperature:</strong> ${current.temp_c} °C</p>
                <p><strong>Feels Like:</strong> ${current.feelslike_c} °C</p>
                <p><strong>Weather:</strong> ${current.condition.text}</p>
                <p><strong>Wind Speed:</strong> ${current.wind_kph} m/s</p>
                <p><strong>Humidity:</strong> ${current.humidity}%</p>
                <p><strong>Pressure:</strong> ${current.pressure_mb} hPa</p>
                <p><strong>Weather:</strong> ${current.condition.text}</p>
                <p><strong>Country:</strong>${location.tz_id}</p>
                <p><strong>Coordinates:</strong> lat:${location.lat};  lon:${location.lon}</p>
            </div>
            <div class="col-md-6 text-center">
                <img src="${`https:${current.condition.icon}`}" alt="Weather Icon" style="width: 80px; height: 80px;">
            </div>
        `;
}

async function getExtendedForecast(city) {
    const extendedForecastList = document.getElementById('extendedForecastList');
    let forecastData;

    await fetch(`/forecast14days?city=${city}`)
        .then((response) => response.json())
        .then((data) => forecastData = data)
        .catch((error) => extendedForecastList.innerHTML = `<p>Error: ${error}</p>`);

    const { forecast } = forecastData;
    extendedForecastList.innerHTML = "";
    forecast.forecastday.forEach(day => {
        const date = new Date(day.date_epoch * 1000);
        const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()}`;

        extendedForecastList.innerHTML += `
                <li class="list-group-item">
                    <div class="row">
                        <div class="col-md-2">
                            <p>Date: ${formattedDate}</p>
                        </div>
                        <div class="col-md-3">
                            <img src= ${`https:${day.day.condition.icon}`} style="width: 40px; height: 40px;">
                            <span>${day.day.condition.text}</span>
                        </div>
                        <div class="col-md-3">
                            <p>Min/Max Temp: ${day.day.mintemp_c}°C / ${day.day.maxtemp_c}°C</p>
                        </div>
                    </div>
                </li>`;
    });

}

async function getCity(city) {
    const cityInfoResult = document.getElementById('cityInfoResult');
    let cityInfoData;

    await fetch(`/city-info?city=${city}`)
        .then((response) => response.json())
        .then((data) => cityInfoData = data)
        .catch((error) => {
            cityInfoResult.innerHTML = `<p class="text-danger">Error: ${error}</p>`
            return
        });

    const { name, latitude, longitude, country, population, is_capital } = cityInfoData[0];
    cityInfoResult.innerHTML = `
            <div class="mt-4 card">
                <div class="card-body">
                    <h5 class="card-title">City Information (API not work with Qazaqstan)</h5>
                    <hr>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Latitude:</strong> ${latitude}</p>
                    <p><strong>Longitude:</strong> ${longitude}</p>
                    <p><strong>Country:</strong> ${country}</p>
                    <p><strong>Population:</strong> ${population}</p>
                    <p><strong>Is Capital:</strong> ${is_capital ? 'Yes' : 'No'}</p>
                </div>
            </div>
        `;
}

function getThreeHours() {
    // const forecastResponse = await fetch(`/forecast?city=${city}`);
    // const weatherResult = document.getElementById('weatherResult');


    // if (forecastResponse.ok) {
    //     const forecastData = await forecastResponse.json();

    //     const cityCoordinates = {
    //         lat: forecastData.city.coord.lat,
    //         lon: forecastData.city.coord.lon
    //     };

    //     map.setView([cityCoordinates.lat, cityCoordinates.lon], 8);

    //     L.marker([cityCoordinates.lat, cityCoordinates.lon]).addTo(map)
    //         .bindPopup(city);

    //     weatherResult.innerHTML = "";
    //     const currentTimestamp = Math.floor(Date.now() / 1000);
    //     const last3HoursForecast = forecastData.list.filter(day => day.dt >= currentTimestamp - 3 * 60 * 60 && day.dt <= currentTimestamp);

    //     last3HoursForecast.forEach(timeSlot => {
    //         const { dt, main, weather, wind } = timeSlot;
    //         const date = new Date(dt * 1000);
    //         const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()} ${date.toLocaleTimeString()}`;
    //         const temperature = main.temp;
    //         const description = weather[0].description;
    //         const windSpeed = wind.speed;
    //         const feelsLike = main.feels_like;
    //         const humidity = main.humidity;
    //         const pressure = main.pressure;
    //         const countryCode = forecastData.city.country;

    //         const card = document.createElement('div');
    //         card.classList.add('col-md-4', 'mb-4');

    //         card.innerHTML = `
    //             <div class="card h-100 w-300"> 
    //                 <div class="card-body">
    //                     <h5 class="card-title">${formattedDate}</h5>
    //                     <p class="card-text">Temperature: ${temperature} °C</p>
    //                     <p class="card-text">Feels Like: ${feelsLike} °C</p>
    //                     <p class="card-text">Weather: ${description}</p>
    //                     <p class="card-text">Wind Speed: ${windSpeed} m/s</p>
    //                     <p class="card-text">Humidity: ${humidity}%</p>
    //                     <p class="card-text">Pressure: ${pressure} hPa</p>
    //                     <p class="card-text">Country Code: ${countryCode}</p>
    //                     <p class="card-text">Coordinates: Lat ${forecastData.city.coord.lat}, Lon ${forecastData.city.coord.lon}</p>
    //                 </div>
    //             </div>
    //         `;

    //         weatherResult.appendChild(card);
    //     });
    // }
    // else {
    //     weatherResult.innerHTML = `<p>Error: ${forecastData.error}</p>`;
    // }
}

function getMonthName(monthIndex) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[monthIndex];
}

function formatTime(date) {
    return `${padZeroes(date.getHours())}:${padZeroes(date.getMinutes())}`;
}

function padZeroes(value) {
    return value < 10 ? `0${value}` : value;
}