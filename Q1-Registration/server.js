const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const {
    body,
    validationResult
} = require("express-validator");

const app = express();

const PORT = 3001;

const uploadDir = path.join(__dirname, "uploads");
const downloadDir = path.join(__dirname, "downloads");

fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(downloadDir, { recursive: true });

app.set("view engine", "ejs");

app.use(express.urlencoded({
    extended: true
}));

app.use("/uploads", express.static(uploadDir));

app.use(express.static(
    path.join(__dirname, "public")
));


// -----------------------------
// MULTER CONFIGURATION
// -----------------------------

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, uploadDir);

    },

    filename: function (req, file, cb) {

        const safeName =
            file.originalname.replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );

        cb(
            null,
            Date.now() + "-" + safeName
        );

    }

});


const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp"
];


const upload = multer({

    storage: storage,

    limits: {
        fileSize: 2 * 1024 * 1024,
        files: 6
    },

    fileFilter: function (req, file, cb) {

        if (allowedTypes.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only JPG, PNG, GIF and WEBP images are allowed."
                )
            );

        }

    }

}).fields([

    {
        name: "profilePic",
        maxCount: 1
    },

    {
        name: "otherPics",
        maxCount: 5
    }

]);


// -----------------------------
// VALIDATION
// -----------------------------

const validators = [

    body("username")
        .trim()
        .isLength({
            min: 3,
            max: 30
        })
        .withMessage(
            "Username must be between 3 and 30 characters."
        ),

    body("password")
        .isLength({
            min: 6
        })
        .withMessage(
            "Password must be at least 6 characters."
        ),

    body("confirmPassword")
        .custom((value, {
            req
        }) => {

            return value === req.body.password;

        })
        .withMessage(
            "Passwords do not match."
        ),

    body("email")
        .isEmail()
        .withMessage(
            "Enter a valid email."
        ),

    body("gender")
        .isIn([
            "Male",
            "Female",
            "Other"
        ])
        .withMessage(
            "Please select gender."
        ),

    body("hobbies")
        .custom(value => {

            const hobbies =
                Array.isArray(value)
                    ? value
                    : value
                        ? [value]
                        : [];

            if (hobbies.length === 0) {

                throw new Error(
                    "Select at least one hobby."
                );

            }

            return true;

        })

];


// -----------------------------
// HOME PAGE
// -----------------------------

app.get("/", function (req, res) {

    res.render("form", {

        values: {},

        errors: []

    });

});


// -----------------------------
// REGISTER
// -----------------------------

app.post(
    "/register",
    function (req, res) {

        upload(req, res, async function (err) {

            const values = req.body || {};

            const errors = [];

            if (err) {

                errors.push({
                    msg: err.message
                });

            }

            for (const validator of validators) {

                await validator.run(req);

            }

            const validationErrors =
                validationResult(req).array();

            errors.push(...validationErrors);

            if (errors.length > 0) {

                return res.status(400).render(
                    "form",
                    {
                        values,
                        errors
                    }
                );

            }


            const profile =
                req.files?.profilePic?.[0] || null;

            const others =
                req.files?.otherPics || [];


            const data = {

                username: values.username,

                email: values.email,

                gender: values.gender,

                hobbies:
                    Array.isArray(values.hobbies)
                        ? values.hobbies
                        : [values.hobbies],

                profilePic:
                    profile
                        ? `/uploads/${profile.filename}`
                        : null,

                otherPics:
                    others.map(
                        file =>
                            `/uploads/${file.filename}`
                    )

            };


            const fileName =
                `registration-${Date.now()}.json`;


            fs.writeFileSync(

                path.join(
                    downloadDir,
                    fileName
                ),

                JSON.stringify(
                    data,
                    null,
                    2
                )

            );


            res.render(
                "result",
                {
                    data,
                    fileName
                }
            );

        });

    }
);


// -----------------------------
// DOWNLOAD ROUTE
// -----------------------------

app.get(
    "/download/:file",
    function (req, res) {

        const safeName =
            path.basename(req.params.file);

        const file =
            path.join(
                downloadDir,
                safeName
            );

        if (!fs.existsSync(file)) {

            return res
                .status(404)
                .send("File not found.");

        }

        res.download(
            file,
            safeName
        );

    }
);


// -----------------------------
// ERROR HANDLER
// -----------------------------

app.use(function (
    err,
    req,
    res,
    next
) {

    res.status(400).render(
        "form",
        {
            values: req.body || {},

            errors: [
                {
                    msg: err.message
                }
            ]
        }
    );

});


app.listen(
    PORT,
    function () {

        console.log(
            `Q1 running at http://localhost:${PORT}`
        );

    }
);
