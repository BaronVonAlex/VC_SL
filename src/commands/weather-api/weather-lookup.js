const { SlashCommandBuilder } = require('discord.js');
const { convertUnixTimeToUTC } = require('../../util/convertTime');
const axios = require('axios');

module.exports = {
    run: () => {},
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get weather information for a city.') 
        .addStringOption(option =>
            option.setName('city')
                .setDescription('City name')
                .setRequired(true)
        ),

    async run({ interaction }) {
        const cityName = interaction.options.getString('city');
        
        try {
            await interaction.deferReply();
            
            const apiKey = process.env.WEATHER_API;
            const apiUrl = `${process.env.WEATHER_API_URL}?q=${encodeURIComponent(cityName)}&appid=${apiKey}`;

            const response = await axios.get(apiUrl);
            const weatherData = response.data;

            const temperatureCelsius = (weatherData.main.temp - 273.15).toFixed(1);
            const temperatureFahrenheit = ((weatherData.main.temp - 273.15) * 9/5 + 32).toFixed(1);
            const minTemperatureCelsius = (weatherData.main.temp_min - 273.15).toFixed(1);
            const maxTemperatureCelsius = (weatherData.main.temp_max - 273.15).toFixed(1);
            const minTemperatureFahrenheit = ((weatherData.main.temp_min - 273.15) * 9/5 + 32).toFixed(1);
            const maxTemperatureFahrenheit = ((weatherData.main.temp_max - 273.15) * 9/5 + 32).toFixed(1);

            const embed = {
                color: 0x0099ff,
                title: 'Weather Information',
                fields: [
                    { name: '🌍 Location', value: `${weatherData.name}, ${weatherData.sys.country}`, inline: true },
                    { name: '📏 Lat/Long', value: `${weatherData.coord.lat}, ${weatherData.coord.lon}`, inline: true },
                    { name: '☁ Condition', value: weatherData.weather[0].description, inline: true },
                    { name: '😓 Humidity', value: `${weatherData.main.humidity}%`, inline: true },
                    { name: '💨 Wind speed', value: `${weatherData.wind.speed} m/s`, inline: true },
                    { name: '🌡 Temperature', value: `${temperatureCelsius}°C / ${temperatureFahrenheit}°F`, inline: true },
                    { name: '🔆 Min/Max', value: `${minTemperatureCelsius}°C - ${maxTemperatureCelsius}°C\n${minTemperatureFahrenheit}°F - ${maxTemperatureFahrenheit}°F`, inline: true },
                    { name: '🌄 Sunrise', value: convertUnixTimeToUTC(weatherData.sys.sunrise), inline: true },
                    { name: '🌇 Sunset', value: convertUnixTimeToUTC(weatherData.sys.sunset), inline: true },
                ],
                timestamp: new Date(),
                footer: {
                    text: 'Data provided by OpenWeatherMap.org',
                },
            };

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching weather data:', error);
            await interaction.editReply('Failed to fetch weather data. Make sure you input proper city name.');
        }
    },
};
