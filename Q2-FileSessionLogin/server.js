const express = require("express");

const session = require("express-session");

const FileStore =
    require("session-file-store")(session);

const path = require("path");

const app = express();

const PORT = 3002;


app.set("view engine", "ejs");

app.use(
    express.urlencoded({
        extended: true
    })
);


app.use(
    session({
        store: new FileStore({
            path: path.join(
                __dirname,
                "sessions"
            )
        }),

        secret: "q2-secret",

        resave: false,

        saveUninitialized: false,

        cookie: {
            maxAge: 30 * 60 * 1000
        }
    })
);


const users = [
    {
        username: "admin",
        password: "123456"
    }
];


function auth(req, res, next) {

    if (req.session.user) {

        return next();

    }

    res.redirect("/");

}


app.get("/", (req, res) => {

    res.render(
        "login",
        {
            error: null
        }
    );

});


app.post(
    "/login",
    (req, res) => {

        const user =
            users.find(
                u =>
                    u.username ===
                    req.body.username &&
                    u.password ===
                    req.body.password
            );


        if (!user) {

            return res.render(
                "login",
                {
                    error:
                        "Invalid username or password"
                }
            );

        }


        req.session.user =
            user.username;


        res.redirect("/home");

    }
);


app.get(
    "/home",
    auth,
    (req, res) => {

        res.render(
            "home",
            {
                user:
                    req.session.user
            }
        );

    }
);


app.get(
    "/profile",
    auth,
    (req, res) => {

        res.render(
            "profile",
            {
                user:
                    req.session.user
            }
        );

    }
);


app.get(
    "/dashboard",
    auth,
    (req, res) => {

        res.render(
            "dashboard",
            {
                user:
                    req.session.user
            }
        );

    }
);


app.get(
    "/logout",
    (req, res) => {

        req.session.destroy(
            () => {
                res.redirect("/");
            }
        );

    }
);


app.listen(
    PORT,
    () => {

        console.log(
            `Q2 running at http://localhost:${PORT}`
        );

    }
);