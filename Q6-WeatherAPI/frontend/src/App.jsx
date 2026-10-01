import { useState } from "react";

function App() {

    const [city, setCity] = useState("");

    const [weather, setWeather] =
        useState(null);

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const getWeather = async () => {

        if (!city.trim()) {

            setError("Please enter a city name");

            return;

        }


        setWeather(null);
        setError("");
        setLoading(true);


        try {

            const response =
                await fetch(
                    `http://localhost:5001/api/weather?city=${encodeURIComponent(city)}`
                );


            const data =
                await response.json();


            if (!response.ok) {

                setError(data.message);

                return;

            }


            setWeather(data);

        }
        catch (error) {

            setError(
                "Cannot connect to backend"
            );

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <div className="container">

            <div className="card">

                <h1>
                    Weather Utility
                </h1>


                <p>
                    Enter a city to get current weather information.
                </p>


                <label>
                    City Name
                </label>


                <input
                    type="text"
                    value={city}
                    onChange={(e) =>
                        setCity(e.target.value)
                    }
                    placeholder="Enter city name"
                />


                <button
                    onClick={getWeather}
                >
                    Get Weather
                </button>


                {loading && (

                    <p className="loading">
                        Loading weather...
                    </p>

                )}


                {error && (

                    <p className="error">
                        {error}
                    </p>

                )}


                {weather && (

                    <div className="weather">

                        <h2>
                            {weather.city}, {weather.country}
                        </h2>


                        <table>

                            <tbody>

                                <tr>

                                    <td>
                                        Temperature
                                    </td>

                                    <td>
                                        {weather.temperature} °C
                                    </td>

                                </tr>


                                <tr>

                                    <td>
                                        Humidity
                                    </td>

                                    <td>
                                        {weather.humidity} %
                                    </td>

                                </tr>


                                <tr>

                                    <td>
                                        Wind Speed
                                    </td>

                                    <td>
                                        {weather.windSpeed} km/h
                                    </td>

                                </tr>


                                <tr>

                                    <td>
                                        Weather Code
                                    </td>

                                    <td>
                                        {weather.weatherCode}
                                    </td>

                                </tr>


                                <tr>

                                    <td>
                                        Latitude
                                    </td>

                                    <td>
                                        {weather.latitude}
                                    </td>

                                </tr>


                                <tr>

                                    <td>
                                        Longitude
                                    </td>

                                    <td>
                                        {weather.longitude}
                                    </td>

                                </tr>


                                <tr>

                                    <td>
                                        Updated Time
                                    </td>

                                    <td>
                                        {weather.time}
                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}

export default App;