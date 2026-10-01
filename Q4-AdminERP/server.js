const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

const Employee = require("./models/Employee");

dotenv.config();

const app = express();

// EJS
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// ===============================
// SESSION
// ===============================

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);


// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.log("MongoDB Error:", error.message);
    });


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {

    if (req.session.admin) {
        return res.redirect("/dashboard");
    }

    res.redirect("/login");
});


// ===============================
// ADMIN LOGIN
// ===============================

app.get("/login", (req, res) => {

    res.render("login", {
        error: null
    });

});


app.post("/login", (req, res) => {

    const { username, password } = req.body;

    // Admin credentials
    if (username === "admin" && password === "admin123") {

        req.session.admin = username;

        res.redirect("/dashboard");

    } else {

        res.render("login", {
            error: "Invalid username or password"
        });

    }

});


// ===============================
// ADMIN AUTHENTICATION
// ===============================

function isAdmin(req, res, next) {

    if (req.session.admin) {

        next();

    } else {

        res.redirect("/login");

    }

}


// ===============================
// DASHBOARD
// ===============================

app.get("/dashboard", isAdmin, async (req, res) => {

    try {

        const count = await Employee.countDocuments();

        res.render("dashboard", {
            count: count
        });

    } catch (error) {

        res.send("Error loading dashboard");

    }

});


// ===============================
// EMPLOYEE LIST
// ===============================

app.get("/employees", isAdmin, async (req, res) => {

    try {

        const employees = await Employee.find();

        res.render("employees", {
            employees: employees
        });

    } catch (error) {

        res.send("Error loading employees");

    }

});


// ===============================
// ADD EMPLOYEE PAGE
// ===============================

app.get("/employees/add", isAdmin, (req, res) => {

    res.render("add");

});


// ===============================
// ADD EMPLOYEE
// ===============================

app.post("/employees/add", isAdmin, async (req, res) => {

    try {

        const {
            name,
            email,
            department,
            basicSalary
        } = req.body;


        // Generate Employee ID

        const count = await Employee.countDocuments();

        const empid =
            "EMP" +
            String(count + 1).padStart(3, "0");


        // Generate random password

        const plainPassword =
            Math.random()
                .toString(36)
                .slice(-8);


        // Encrypt password

        const encryptedPassword =
            await bcrypt.hash(plainPassword, 10);


        // Salary calculation

        const basic = Number(basicSalary);

        const hra = basic * 0.20;

        const da = basic * 0.10;

        const totalSalary =
            basic + hra + da;


        // Create employee

        const employee = new Employee({

            empid: empid,

            name: name,

            email: email,

            department: department,

            basicSalary: basic,

            hra: hra,

            da: da,

            totalSalary: totalSalary,

            password: encryptedPassword

        });


        await employee.save();


        // ===============================
        // SEND EMAIL
        // ===============================

        if (
            process.env.EMAIL_USER &&
            process.env.EMAIL_PASS
        ) {

            const transporter =
                nodemailer.createTransport({

                    service: "gmail",

                    auth: {

                        user: process.env.EMAIL_USER,

                        pass: process.env.EMAIL_PASS

                    }

                });


            await transporter.sendMail({

                from: process.env.EMAIL_USER,

                to: email,

                subject: "Employee Account Created",

                text:
`Hello ${name},

Your employee account has been created.

Employee ID: ${empid}

Password: ${plainPassword}

Basic Salary: ${basic}

HRA: ${hra}

DA: ${da}

Total Salary: ${totalSalary}

Please keep your credentials safe.`

            });

        }


        res.redirect("/employees");


    } catch (error) {

        console.log(error);

        res.send("Error while adding employee.");

    }

});


// ===============================
// EMPLOYEE DETAILS
// ===============================

app.get("/employees/:id", isAdmin, async (req, res) => {

    try {

        const employee =
            await Employee.findById(req.params.id);


        if (!employee) {

            return res.send("Employee not found");

        }


        res.render("details", {
            employee: employee
        });


    } catch (error) {

        res.send("Error loading employee");

    }

});


// ===============================
// EDIT EMPLOYEE PAGE
// ===============================

app.get("/employees/edit/:id", isAdmin, async (req, res) => {

    try {

        const employee =
            await Employee.findById(req.params.id);


        if (!employee) {

            return res.send("Employee not found");

        }


        res.render("edit", {
            employee: employee
        });


    } catch (error) {

        res.send("Error loading employee");

    }

});


// ===============================
// UPDATE EMPLOYEE
// ===============================

app.post("/employees/edit/:id", isAdmin, async (req, res) => {

    try {

        const {
            name,
            email,
            department,
            basicSalary
        } = req.body;


        const basic = Number(basicSalary);

        const hra = basic * 0.20;

        const da = basic * 0.10;

        const totalSalary =
            basic + hra + da;


        await Employee.findByIdAndUpdate(
            req.params.id,
            {
                name: name,
                email: email,
                department: department,
                basicSalary: basic,
                hra: hra,
                da: da,
                totalSalary: totalSalary
            }
        );


        res.redirect("/employees");


    } catch (error) {

        res.send("Error updating employee");

    }

});


// ===============================
// DELETE EMPLOYEE
// ===============================

app.post("/employees/delete/:id", isAdmin, async (req, res) => {

    try {

        await Employee.findByIdAndDelete(
            req.params.id
        );

        res.redirect("/employees");

    } catch (error) {

        res.send("Error deleting employee");

    }

});


// ===============================
// LOGOUT
// ===============================

app.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/login");

    });

});


// ===============================
// START SERVER
// ===============================

app.listen(process.env.PORT, () => {

    console.log(
        `Server running at http://localhost:${process.env.PORT}`
    );

});