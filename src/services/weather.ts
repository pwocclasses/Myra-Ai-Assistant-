// Live Weather Service using Open-Meteo free API

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  windSpeed: number;
  humidity: number;
  forecast: { time: string; temp: number }[];
}

export async function fetchLiveWeather(cityName: string = 'New Delhi'): Promise<WeatherData> {
  try {
    // City coordinates lookup
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
    );
    const geoData = await geoRes.json();
    
    let lat = 28.6139;
    let lon = 77.2090;
    let detectedCity = cityName;

    if (geoData?.results?.[0]) {
      lat = geoData.results[0].latitude;
      lon = geoData.results[0].longitude;
      detectedCity = `${geoData.results[0].name}, ${geoData.results[0].country || ''}`;
    }

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m&forecast_days=1`
    );
    const data = await weatherRes.json();

    const code = data?.current?.weather_code ?? 0;
    let condition = 'Clear Sky';
    if (code >= 1 && code <= 3) condition = 'Partly Cloudy';
    else if (code >= 45 && code <= 48) condition = 'Foggy / Hazy';
    else if (code >= 51 && code <= 67) condition = 'Light Rain';
    else if (code >= 71 && code <= 77) condition = 'Snowy';
    else if (code >= 80 && code <= 82) condition = 'Rain Showers';
    else if (code >= 95) condition = 'Thunderstorm';

    const hourlyTemps = (data?.hourly?.temperature_2m || []).slice(12, 18).map((temp: number, i: number) => ({
      time: `${12 + i}:00`,
      temp: Math.round(temp),
    }));

    return {
      city: detectedCity,
      temperature: Math.round(data?.current?.temperature_2m ?? 28),
      condition,
      windSpeed: Math.round(data?.current?.wind_speed_10m ?? 12),
      humidity: Math.round(data?.current?.relative_humidity_2m ?? 45),
      forecast: hourlyTemps,
    };
  } catch (err) {
    console.warn('Weather fetch fallback:', err);
    return {
      city: cityName,
      temperature: 28,
      condition: 'Sunny & Pleasant',
      windSpeed: 10,
      humidity: 50,
      forecast: [
        { time: '12:00', temp: 27 },
        { time: '14:00', temp: 30 },
        { time: '16:00', temp: 29 },
        { time: '18:00', temp: 26 },
      ],
    };
  }
}
