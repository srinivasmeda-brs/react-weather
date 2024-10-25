import { useState } from "react";
import axios from "axios";
import "./index.css"; // Import the CSS file for styling

const WeatherApp = () => {
  const [weatherDetails, setWeatherDetails] = useState(null);
  const [noCityFound, setNoCityFound] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

  const getWeather = async () => {
    const BaseURL = "https://api.openweathermap.org/data/2.5/weather";
    const API_KEY = "60bbd59ec7556e88c0f6b5a2080aebaa"; // Make sure this is set in .env

    const queryParams = {
      q: searchValue,
      units: "metric",
      APPID: API_KEY,
    };

    const oURL = `${BaseURL}?${new URLSearchParams(queryParams).toString()}`;

    setLoading(true); // Set loading to true before fetching data

    try {
      const response = await axios.get(oURL);
      setWeatherDetails(response.data);
      setNoCityFound(null);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setNoCityFound("City not found. Please try another search.");
        } else if (error.response.status === 400) {
          setNoCityFound("Bad Request: Please check the input.");
        }
      } else {
        console.error("Error fetching weather data:", error.message);
      }
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  return (
    <div className="weather-app">
      <h1 className="app-title">Weather App</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter city"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && getWeather()}
        />
        <button onClick={getWeather}>Get Weather</button>
      </div>
      {loading && <p className="loader">Loading...</p>} {/* Loader message */}
      {noCityFound && <p className="error">{noCityFound}</p>}
      {weatherDetails && (
        <div className="weather-details">
          <h2 className="city-name">{weatherDetails.name}</h2>
          <p>Temperature: {weatherDetails.main.temp}°C</p>
          <p>Weather: {weatherDetails.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
