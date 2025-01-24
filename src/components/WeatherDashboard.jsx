import React, { useState } from "react";
import "./WeatherDashboard.css";

const WeatherDashboard = () => {
  // State to track which page to show (welcome, form, or weather)
  const [currentPage, setCurrentPage] = useState("welcome");
  // State to store weather data fetched from the API
  const [weatherData, setWeatherData] = useState(null);

  // Function to handle submission of location form
  const handleFormSubmit = (data) => {
    setWeatherData(data); // Save the weather data
    setCurrentPage("weather"); // Move to the weather display page
  };

  return (
    <div>
      {currentPage === "welcome" && (
        <WelcomePage onSearch={() => setCurrentPage("form")} />
      )}  
      {currentPage === "form" && <LocationForm onSubmit={handleFormSubmit} />}
      {currentPage === "weather" && (
        <WeatherDisplay data={weatherData} onBack={() => setCurrentPage("welcome")} />
      )}
    </div>
  );
};

// Welcome page component
const WelcomePage = ({ onSearch }) => {
  return (
    <div className="card">
      <h1>Welcome to the Weather Dashboard</h1>
      <p>Get weather updates for any location.</p>
      <button onClick={onSearch}>Check Weather</button>
    </div>
  );
};

// Location form component
const LocationForm = ({ onSubmit }) => {
  const [location, setLocation] = useState(""); // State to track user input

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      alert("Please enter a location.");
      return;
    }
    try {
      const response = await fetch("https://kbmiranaapi.azurewebsites.net/getWeather", {
          method: "POST",
          headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify(weatherData),    
        });

        if(response.ok){
          const result = await response.json();
          alert("Data is submitted successfully");
          console.log("API Response:", result)
          console.log("Data submission was successful");

          //reset the dashboard
          setLocation({
            location:"",
          });
        } else {
          alert("failed to submit");
          console.error("API Error", response.statusText);
        }
    } catch(error){
      alert("An error occured while submitting data");
      console.error("error", error);
    }
    const apiKey = "b8bba5253379226c8bb1c2893f70e181"; // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
    try {
      const response = await fetch(apiUrl + `&appid=b8bba5253379226c8bb1c2893f70e181`);
      if (!response.ok) {
        throw new Error("Location not found.");
      }

      const data = await response.json();

      onSubmit(data); // Pass the weather data to the parent component
    } catch (error) {
      alert(error.message);
    }
  };

  
  return (
    <div className="card">
      <h1>Enter Location</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="City name"
          value={location}
          onChange={(e) => setLocation(e.target.value)} // Update state with user input
        />
        <button type="submit">Get Weather</button>
      </form>
    </div>
  );
};

// Weather display component
const WeatherDisplay = ({ data, onBack }) => {
  return (
    <div className="weather-card">
      <h2>{data.name}</h2>
      <p className="weather-condition">{data.weather[0].main}</p>
      <div className="weather-temperature">
        <span>{Math.round(data.main.temp)}°C</span>
      </div>
      <div className="weather-details">
        <div className="weather-box">
          <p><strong>Condition</strong></p>
          <p>{data.weather[0].description}</p>
        </div>
        <div className="weather-box">
          <p><strong>Humidity</strong></p>
          <p>{data.main.humidity}%</p>
        </div>
        <div className="weather-box">
          <p><strong>Wind</strong></p>
          <p>{data.wind.speed} m/s</p>
        </div>
      </div>
      <button onClick={onBack}>Back to Home</button>
    </div>
  );
};


export default WeatherDashboard;