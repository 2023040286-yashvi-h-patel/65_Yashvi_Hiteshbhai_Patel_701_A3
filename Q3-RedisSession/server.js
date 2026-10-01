require("dotenv").config();

const express = require("express");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const { createClient } = require("redis");

const app = express();

const PORT = process.env.PORT || 5004;


// Redis Client
const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error", (error) => {
    console.log("Redis Error:", error.message);
});


// EJS
app.set("view engine", "ejs");


// Middleware
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(express.static("public"));


// Redis Session Store
app.use(
    session({
        store: new RedisStore({
            client: redisClient,
            prefix: "q3:"
        }),

        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        cookie: {
            maxAge: 1000 * 60 * 30
        }
    })
);


// LOGIN PAGE
app.get("/", (req, res) => {

    if (req.session.user) {
        return res.redirect("/home");
    }

    res.render("login", {
        error: null
    });
});


// LOGIN
app.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;


    // Demo login
    if (
        username === "admin" &&
        password === "123456"
    ) {

        req.session.user = {
            username: username
        };

        return res.redirect("/home");
    }


    res.render("login", {
        error: "Invalid username or password"
    });
});


// AUTHENTICATION MIDDLEWARE
function isAuthenticated(req, res, next) {

    if (req.session.user) {

        next();

    }
    else {

        res.redirect("/");

    }
}


// HOME - PROTECTED
app.get("/home", isAuthenticated, (req, res) => {

    res.render("home", {
        username: req.session.user.username
    });

});


// PROFILE - PROTECTED ROUTE 1
app.get("/profile", isAuthenticated, (req, res) => {

    res.render("profile", {
        username: req.session.user.username
    });

});


// DASHBOARD - PROTECTED ROUTE 2
app.get("/dashboard", isAuthenticated, (req, res) => {

    res.render("dashboard", {
        username: req.session.user.username
    });

});


// LOGOUT
app.get("/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            return res.send(
                "Unable to logout"
            );

        }

        res.redirect("/");

    });

});


// START SERVER
async function startServer() {

    try {

        await redisClient.connect();

        console.log("Redis Connected Successfully");

        app.listen(PORT, () => {

            console.log(
                `Server running at http://localhost:${PORT}`
            );

        });

    }
    catch (error) {

        console.log("Redis connection failed");

        console.log(error.message);

    }
}


startServer();