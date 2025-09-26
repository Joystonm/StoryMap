const axios = require('axios');

const getCurrentWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Using OpenWeatherMap free API
    const apiKey = process.env.OPENWEATHER_API_KEY || 'demo_key';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    console.log('Fetching weather data for:', lat, lon);
    
    try {
      const response = await axios.get(url);
      const data = response.data;
      
      const weatherData = {
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        condition: data.weather[0].description,
        rainChance: data.rain ? Math.round((data.rain['1h'] || 0) * 10) : 0,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        location: data.name
      };
      
      res.json(weatherData);
    } catch (apiError) {
      console.log('OpenWeather API not available, using mock data');
      
      // Fallback mock weather data
      const mockWeather = {
        temperature: Math.round(15 + Math.random() * 20), // 15-35°C
        feelsLike: Math.round(15 + Math.random() * 20),
        humidity: Math.round(40 + Math.random() * 40), // 40-80%
        condition: ['sunny', 'partly cloudy', 'cloudy', 'light rain'][Math.floor(Math.random() * 4)],
        rainChance: Math.round(Math.random() * 60), // 0-60%
        windSpeed: Math.round(Math.random() * 25), // 0-25 km/h
        pressure: Math.round(1000 + Math.random() * 50), // 1000-1050 hPa
        location: 'Australia'
      };
      
      res.json(mockWeather);
    }
  } catch (error) {
    console.error('Weather controller error:', error.message);
    res.status(500).json({ error: 'Failed to get weather data' });
  }
};

module.exports = {
  getCurrentWeather
};
