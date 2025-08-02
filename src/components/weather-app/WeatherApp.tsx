import React, { useState, useEffect } from 'react';
import { BackButton } from '../../shared/back-button/BackButton';
import './WeatherApp.scss';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

const WeatherApp: React.FC = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const mockWeatherData: WeatherData[] = [
    { city: 'New York', temperature: 22, description: 'Sunny', humidity: 65, windSpeed: 10 },
    { city: 'London', temperature: 15, description: 'Cloudy', humidity: 80, windSpeed: 15 },
    { city: 'Tokyo', temperature: 28, description: 'Partly Cloudy', humidity: 70, windSpeed: 8 },
    { city: 'Paris', temperature: 18, description: 'Rainy', humidity: 85, windSpeed: 12 },
    { city: 'Sydney', temperature: 25, description: 'Clear', humidity: 60, windSpeed: 14 },
  ];

  const handleSearch = () => {
    if (!city.trim()) return;
    
    setLoading(true);
    setTimeout(() => {
      const foundWeather = mockWeatherData.find(
        w => w.city.toLowerCase() === city.toLowerCase()
      ) || {
        city: city,
        temperature: Math.floor(Math.random() * 35) + 5,
        description: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5
      };
      
      setWeather(foundWeather);
      setLoading(false);
    }, 1000);
  };

  const getWeatherIcon = (description: string) => {
    switch (description.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return '☀️';
      case 'cloudy':
        return '☁️';
      case 'partly cloudy':
        return '⛅';
      case 'rainy':
        return '🌧️';
      default:
        return '🌤️';
    }
  };

  return (
    <div className="weather-app">
      <BackButton />
      <div className="weather-container">
        <h1 className="weather-title">Weather Forecast</h1>
        
        <div className="search-section">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="city-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="search-btn" disabled={loading}>
            {loading ? '🔄' : '🔍'}
          </button>
        </div>

        {weather && (
          <div className="weather-card">
            <div className="weather-header">
              <h2 className="city-name">{weather.city}</h2>
              <div className="weather-icon">{getWeatherIcon(weather.description)}</div>
            </div>
            
            <div className="temperature-section">
              <span className="temperature">{weather.temperature}°C</span>
              <span className="description">{weather.description}</span>
            </div>
            
            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-label">💧 Humidity</span>
                <span className="detail-value">{weather.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">💨 Wind Speed</span>
                <span className="detail-value">{weather.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
