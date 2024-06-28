import React, { useState } from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flip, Slide } from 'react-toastify';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';
import axios from 'axios';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    setError('');
    setWeather(null);
    try {
      const API_Key = "2PGW6eB95IWAg08sCY9kSgEssF3UUAwC";
      const locationSearch = await axios.get(`http://dataservice.accuweather.com/locations/v1/cities/search`, {
        params: {
          apikey: API_Key,
          q: city,
        },
      });
      const locationKey = locationSearch.data;
      console.log(locationKey);
      if (!locationKey.length) {
        throw new Error('Error : City not found');
      }
      const reqLocation = locationKey[0]

      setData(locationKey[0]);
      const response = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${reqLocation.Key}`, {
        params: {
          apikey: API_Key,
        },
      });
      const reqData = response.data;
      console.log(reqData)

      if (!reqData.length) {
        throw new Error('Error : Weather data not found');
      }

      setWeather(reqData[0]);
      toast.success('Found Successfully', {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Flip,
      });
    } catch (error) {
      setError(error.message);
      toast.error('Error 404', {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });
      console.error('Error fetching weather data:', error);
    }
  };

  const getWeatherIcon = (weatherText) => {
    switch (weatherText) {
      case 'Sunny':
        return <WiDaySunny size={64} />;
      case 'Cloudy':
        return <WiCloudy size={64} />;
      case 'Rain':
        return <WiRain size={64} />;
      case 'Snow':
        return <WiSnow size={64} />;
      case 'Thunderstorm':
        return <WiThunderstorm size={64} />;
      default:
        return <WiDaySunny size={64} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-200 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">AnyTimeWeather</h1>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Enter city name"
        />
        <button
          onClick={fetchWeather}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition-colors duration-200"
        >
          Get Weather
        </button>
        {error && (
          <div className="mt-4 p-4 bg-red-100 rounded-lg text-red-700">
            <b>{error}</b>
          </div>
        )}
        {weather && (
          <div className="mt-4 p-4 bg-blue-100 rounded-lg flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{data.EnglishName}, {data.Country.EnglishName}</h2>
              <p className="text-2xl">{Math.round(weather.Temperature.Metric.Value)}°C</p>
              <p className="text-lg">{weather.WeatherText}</p>
            </div>
            <div className="ml-4">
              {getWeatherIcon(weather.WeatherText)}
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
