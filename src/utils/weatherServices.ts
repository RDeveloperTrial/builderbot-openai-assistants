import axios from 'axios';
import moment from 'moment-timezone'; 
import tzlookup from 'tz-lookup'; //Determina zona horaria en función de coordenadas

// Define la URL base y tu API Key
const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const BASE_URL_FORECAST = 'https://api.openweathermap.org/data/2.5/forecast';
const GEO_BASE_URL = 'http://api.openweathermap.org/geo/1.0/direct';
const ONECALL_BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';


// Función para obtener las coordenadas de la ciudad
async function getCoordinates(city: string): Promise<{ lat: number; lon: number } | null> {
    try {
        const response = await axios.get(GEO_BASE_URL, {
            params: {
                q: city,
                limit: 1,
                appid: OPEN_WEATHER_KEY,
            },
        });

        const data = response.data;
        if (data.length > 0) {
            const { lat, lon } = data[0];
            return { lat, lon };
        } else {
            console.error('No se encontraron coordenadas para la ciudad proporcionada.');
            return null;
        }
    } catch (error) {
        console.error('Error al obtener las coordenadas:', error);
        return null;
    }
}

// Función para obtener el clima actual usando el endpoint weather
async function getCurrentWeather(lat: number, lon: number) {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                lat: lat,
                lon: lon,
                units: 'metric', // Métrico para grados Celsius
                appid: OPEN_WEATHER_KEY,
            },
        });

        const weatherData = response.data;

        // Mostrar algunos detalles del clima actual en la consola
        const weather =
            `Clima actual para ${weatherData.name}, ${weatherData.sys.country}:
            🌡️: ${Math.round(weatherData.main.temp)}°C
            ⛅️: ${weatherData.weather[0].description}
            💧: ${weatherData.main.humidity}%
            💨: ${weatherData.wind.speed} m/s`
        return weather
    } catch (error) {
        console.error('Error al obtener el clima actual:', error);
    }
}

// Función principal para obtener el clima actual por nombre de ciudad
async function getWeatherByCity(city: string) {
    // Obtener las coordenadas de la ciudad
    const coordinates = await getCoordinates(city);
    if (coordinates) {
        const { lat, lon } = coordinates;
        // Llamar a la API weather con las coordenadas obtenidas
        return await getCurrentWeather(lat, lon);
    }
}

// Función principal para obtener el clima actual por nombre de ciudad
async function getForecastByCity(city: string) {
    // Obtener las coordenadas de la ciudad
    const coordinates = await getCoordinates(city);
    if (coordinates) {
        const { lat, lon } = coordinates;
        // Llamar a la API weather con las coordenadas obtenidas
        return await getWeatherForecast(lat, lon);
    }
}





// Función para obtener el pronóstico del tiempo por localización
async function getWeatherForecast(lat: number, lon: number) {
    try {
        // Hacer la petición GET a la API de OpenWeatherMap
        const response = await axios.get(BASE_URL_FORECAST, {
            params: {
                lat: lat,
                lon: lon,
                appid: OPEN_WEATHER_KEY,
                cnt: 5, //Limita el número de items en la lista
                units: 'metric', // Esto devolverá las temperaturas en grados Celsius
            },
        });

        // La respuesta de la API contiene el pronóstico
        const forecast = response.data;

        const timezone = tzlookup(lat,lon); // Determinar la zona horaria desde las coordenadas
        
        // Mostrar algunos detalles del pronóstico en la consola
        const intro = `Pronóstico para ${forecast.city.name}, ${forecast.city.country}:`;
        const weatherArray = [];
        weatherArray.push(intro)
        forecast.list.forEach((entry) => {
            const dateTime = moment.utc(entry.dt * 1000).tz(timezone); // Convertir UTC a zona horaria local
            const date = dateTime.format('DD-MM-YYYY'); // Formato de fecha
            const time = dateTime.format('HH:mm'); // Formato de hora
            const weather =
                `   ${date}
                🕙: ${time}
                🌡️: ${Math.round(entry.main.temp)} °C
                ⛅️: ${entry.weather[0].description}`
            weatherArray.push(weather)
        });
        return weatherArray
    } catch (error) {
        console.error('Error al obtener el pronóstico del tiempo:', error);
    }
}

export { getForecastByCity, getWeatherByCity }
