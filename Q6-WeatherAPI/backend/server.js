const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// Home route
app.get("/", (req, res) => {

    res.send("Q6 Weather API Backend is Running");

});


// Weather route
app.get("/api/weather", async (req, res) => {

    try {

        const city = req.query.city;

        if (!city) {

            return res.status(400).json({
                message: "City name is required"
            });

        }


        // -----------------------------------------
        // STEP 1: Find latitude and longitude
        // -----------------------------------------

        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );


        if (!locationResponse.ok) {

            return res.status(500).json({
                message: "Error calling location API"
            });

        }


        const locationData =
            await locationResponse.json();


        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            return res.status(404).json({
                message: "City not found"
            });

        }


        const location =
            locationData.results[0];


        const latitude =
            location.latitude;

        const longitude =
            location.longitude;


        // -----------------------------------------
        // STEP 2: Call Weather API
        // -----------------------------------------

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=celsius&wind_speed_unit=kmh`
        );


        if (!weatherResponse.ok) {

            return res.status(500).json({
                message: "Error calling weather API"
            });

        }


        const weatherData =
            await weatherResponse.json();


        // -----------------------------------------
        // STEP 3: Send result to React
        // -----------------------------------------

        res.json({

            city: location.name,

            country: location.country,

            latitude: latitude,

            longitude: longitude,

            temperature:
                weatherData.current.temperature_2m,

            humidity:
                weatherData.current.relative_humidity_2m,

            windSpeed:
                weatherData.current.wind_speed_10m,

            weatherCode:
                weatherData.current.weather_code,

            time:
                weatherData.current.time

        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message:
                "Server error while getting weather"

        });

    }

});


app.listen(5001, () => {

    console.log(
        "Backend running at http://localhost:5001"
    );

});