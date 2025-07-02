const axios = require('axios');
const fs = require('fs');

async function updateWeather() {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const city = process.env.CITY;
    
                   if (!apiKey) {
       console.log('⚠️  WEATHER_API_KEY not found. Using mock data.');
       const mockWeather = {
         city: city,
         country: 'VN',
         temperature: Math.floor(Math.random() * 15) + 25,
         description: ['sunny', 'cloudy', 'rainy', 'partly cloudy'][Math.floor(Math.random() * 4)],
         humidity: Math.floor(Math.random() * 30) + 60,
         windSpeed: Math.floor(Math.random() * 10) + 5,
         lastUpdated: new Date().toISOString()
       };
       
       fs.writeFileSync('weather.json', JSON.stringify(mockWeather, null, 2));
       
       // Update README with mock weather table
       let readme = fs.readFileSync('README.md', 'utf8');
       const mockWeatherTable = '<!-- WEATHER:START -->' + '\n' +
         '## 🌤️ Current Weather in ' + mockWeather.city + ', ' + mockWeather.country + '\n\n' +
         '| 🕐 Time | 🌡️ Temperature | 🌤️ Condition | 💧 Humidity | 💨 Wind Speed | 🗓️ Last Updated |\n' +
         '|---------|---------------|--------------|-------------|--------------|------------------|\n' +
         '| Now | ' + mockWeather.temperature + '°C | ' + 
         (mockWeather.description.charAt(0).toUpperCase() + mockWeather.description.slice(1)) + ' | ' +
         mockWeather.humidity + '% | ' + mockWeather.windSpeed + ' m/s | ' +
         new Date(mockWeather.lastUpdated).toLocaleString('en-US', { timeZone: 'UTC', timeZoneName: 'short' }) + ' |\n\n' +
         '---\n' +
         '<!-- WEATHER:END -->';
       
       if (readme.includes('<!-- WEATHER:START -->')) {
         readme = readme.replace(/<!-- WEATHER:START -->[\s\S]*<!-- WEATHER:END -->/, mockWeatherTable);
       } else {
         readme = readme.replace('### Hi there 👋', '### Hi there 👋' + '\n\n' + mockWeatherTable);
       }
       
       fs.writeFileSync('README.md', readme);
       console.log('✅ Mock weather data updated successfully');
       return;
     }
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    
    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: Math.round(response.data.main.temp),
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      icon: response.data.weather[0].icon,
      lastUpdated: new Date().toISOString()
    };
    
    // Save to JSON file
    fs.writeFileSync('weather.json', JSON.stringify(weatherData, null, 2));
    
    // Create a weather badge for README
    const weatherBadge = `![Weather](https://img.shields.io/badge/Weather-${weatherData.temperature}°C%20${encodeURIComponent(weatherData.description)}-blue?style=flat-square)`;
    
                                  // Update README with weather table
     let readme = fs.readFileSync('README.md', 'utf8');
     
     // Create weather table
     const weatherTable = '<!-- WEATHER:START -->' + '\n' +
       '## 🌤️ Current Weather in ' + weatherData.city + ', ' + weatherData.country + '\n\n' +
       '| 🕐 Time | 🌡️ Temperature | 🌤️ Condition | 💧 Humidity | 💨 Wind Speed | 🗓️ Last Updated |\n' +
       '|---------|---------------|--------------|-------------|--------------|------------------|\n' +
       '| Now | ' + weatherData.temperature + '°C | ' + 
       (weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1)) + ' | ' +
       weatherData.humidity + '% | ' + weatherData.windSpeed + ' m/s | ' +
       new Date(weatherData.lastUpdated).toLocaleString('en-US', { timeZone: 'UTC', timeZoneName: 'short' }) + ' |\n\n' +
       '---\n' +
       '<!-- WEATHER:END -->';
     
     if (readme.includes('<!-- WEATHER:START -->')) {
       readme = readme.replace(/<!-- WEATHER:START -->[\s\S]*<!-- WEATHER:END -->/, weatherTable);
     } else {
       readme = readme.replace('### Hi there 👋', `### Hi there 👋\n\n${weatherTable}`);
     }
    
    fs.writeFileSync('README.md', readme);
    
    console.log(`✅ Weather updated: ${weatherData.temperature}°C, ${weatherData.description} in ${weatherData.city}`);
    
  } catch (error) {
    console.error('❌ Error updating weather:', error.message);
    process.exit(1);
  }
}

updateWeather();
