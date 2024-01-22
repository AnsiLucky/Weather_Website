const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

const openWeatherAPIkey = process.env.OPEN_WEATHER_API;
const weatherAPIkey = process.env.WEATHER_API;
const cityAPIkey = process.env.CITY_API;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/forecast', async (req, res) => {
    const city = req.query.city;
    if (!city)
        return res.status(400).json({ error: 'City parameter is required' });
    const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${openWeatherAPIkey}&units=metric`;
    forecast(res, apiUrl);
});

app.get('/current', async (req, res) => {
    const city = req.query.city;
    if (!city)
        return res.status(400).json({ error: 'City parameter is required' });
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${weatherAPIkey}&q=${city}&aqi=no`;
    forecast(res, apiUrl);
});

app.get('/forecast14days', async (req, res) => {
    const city = req.query.city;
    if (!city)
        return res.status(400).json({ error: 'City parameter is required' });
    const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${weatherAPIkey}&q=${city}&aqi=no&days=14`;
    forecast(res, apiUrl);
});

app.get('/city-info', async (req, res) => {
    const cityName = req.query.city;
    const apiUrl = `https://api.api-ninjas.com/v1/city?name=${cityName}`;

    fetch(apiUrl, {
        headers: {
            'X-Api-Key': cityAPIkey
        }
    })
        .then((response) => response.json())
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ error: error }));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

async function forecast(res, apiUrl) {
    await fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => res.json(data))
        .catch((error) => res.status(response.status).json({ error: error }));
}