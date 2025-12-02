import { Command } from './types';

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  windSpeed: number;
  humidity: number;
}

const cities = [
  { name: "Oslo", lat: 59.91, lon: 10.75 },
  { name: "Bergen", lat: 60.39, lon: 5.32 },
  { name: "Trondheim", lat: 63.43, lon: 10.39 },
  { name: "Stavanger", lat: 58.97, lon: 5.73 },
  { name: "Kristiansand", lat: 58.15, lon: 8.00 },
  { name: "Tromsø", lat: 69.65, lon: 18.96 },
  { name: "Bodø", lat: 67.28, lon: 14.37 },
  { name: "Ålesund", lat: 62.47, lon: 6.15 },
  { name: "Drammen", lat: 59.74, lon: 10.20 },
  { name: "Fredrikstad", lat: 59.22, lon: 10.95 }
];

async function fetchWeather(city: { name: string; lat: number; lon: number }): Promise<WeatherData> {
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${city.lat}&lon=${city.lon}`;
  
  const response = await fetch(url, {
    headers: { "User-Agent": "Rubberduck/1.0 (es@rubberduck.no)" }
  });
  const data = await response.json();
  
  const latest = data.properties.timeseries[0];
  const details = latest.data.instant.details;
  const symbol = latest.data.next_1_hours.summary.symbol_code;
  
  return {
    city: city.name,
    temperature: details.air_temperature,
    condition: symbol.replace("_", " "),
    windSpeed: details.wind_speed,
    humidity: details.relative_humidity
  };
}

export const weatherCommand: Command = {
  name: 'weather',
  description: 'Show weather for a city or all cities',
  execute: async (args, { setLines }) => {
    try {
      setLines(prev => [...prev, { content: 'Fetching weather data...', type: 'output' }]);
      
      if (args.length > 0) {
        const cityName = args.join(' ');
        const city = cities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
        
        if (city) {
          const weather = await fetchWeather(city);
          setLines(prev => [
            ...prev,
            { content: `Weather for ${weather.city}:`, type: 'output' },
            { content: `  Temperature: ${weather.temperature}°C`, type: 'output' },
            { content: `  Condition: ${weather.condition}`, type: 'output' },
            { content: `  Wind Speed: ${weather.windSpeed} m/s`, type: 'output' },
            { content: `  Humidity: ${weather.humidity}%`, type: 'output' }
          ]);
        } else {
          setLines(prev => [
            ...prev,
            { content: `City not found: ${cityName}`, type: 'output' },
            { content: 'Available cities: ' + cities.map(c => c.name).join(', '), type: 'output' }
          ]);
        }
      } else {
        const weatherData = await Promise.all(cities.map(fetchWeather));
        setLines(prev => [
          ...prev,
          { content: 'Current weather in Norwegian cities:', type: 'output' },
          ...weatherData.map(weather => ({
            content: `${weather.city}: ${weather.temperature}°C, ${weather.condition}`,
            type: 'output' as const
          }))
        ]);
      }
    } catch (error) {
      setLines(prev => [...prev, { content: 'Error fetching weather data. Please try again later.', type: 'output' }]);
    }
  }
};