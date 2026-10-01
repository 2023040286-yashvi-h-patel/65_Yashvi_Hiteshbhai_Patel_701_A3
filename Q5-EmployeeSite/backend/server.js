const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");

const Employee = require("./models/Employee");
const Leave = require("./models/Leave");

dotenv.config();

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {

        console.log("MongoDB Connected");

        await createDemoEmployee();

    })
    .catch((error) => {

        console.log("MongoDB Error:");
        console.log(error.message);

    });


// ==========================================
// CREATE DEMO EMPLOYEE
// ==========================================

async function createDemoEmployee() {

    try {

        const encryptedPassword =
            await bcrypt.hash("123456", 10);

        const employee =
            await Employee.findOneAndUpdate(
                { empid: "EMP001" },
                {
                    empid: "EMP001",
                    name: "Yashvi Patel",
                    email: "yashvi@gmail.com",
                    department: "IT",
                    basicSalary: 50000,
                    hra: 10000,
                    da: 5000,
                    totalSalary: 65000,
                    password: encryptedPassword
                },
                {
                    new: true,
                    upsert: true
                }
            );

        console.log("--------------------------------");
        console.log("Demo Employee Ready");
        console.log("Employee ID: EMP001");
        console.log("Password: 123456");
        console.log("Name: Yashvi Patel");
        console.log("--------------------------------");

    }
    catch (error) {

        console.log(
            "Demo employee error:",
            error.message
        );

    }

}


// ==========================================
// HOME / TEST
// ==========================================

app.get("/", (req, res) => {

    res.send("Q5 Employee API is running");

});


// ==========================================
// LOGIN
// ==========================================

app.post("/api/login", async (req, res) => {

    try {

        const {
            empid,
            password
        } = req.body;


        if (!empid || !password) {

            return res.status(400).json({
                message:
                    "Employee ID and password are required"
            });

        }


        const employee =
            await Employee.findOne({
                empid: empid
            });


        if (!employee) {

            return res.status(401).json({
                message:
                    "Invalid Employee ID or password"
            });

        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                employee.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                message:
                    "Invalid Employee ID or password"
            });

        }


        const token =
            jwt.sign(

                {
                    id: employee._id,
                    empid: employee.empid
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "1h"
                }

            );


        res.json({

            message: "Login successful",

            token: token,

            employee: {

                id: employee._id,

                empid: employee.empid,

                name: employee.name,

                email: employee.email,

                department: employee.department

            }

        });


    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// ==========================================
// JWT MIDDLEWARE
// ==========================================

function verifyToken(req, res, next) {

    const authHeader =
        req.headers.authorization;


    if (!authHeader) {

        return res.status(401).json({
            message: "No token provided"
        });

    }


    const token =
        authHeader.split(" ")[1];


    if (!token) {

        return res.status(401).json({
            message: "Invalid token"
        });

    }


    try {

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        req.employee = decoded;

        next();

    }
    catch (error) {

        return res.status(401).json({
            message:
                "Invalid or expired token"
        });

    }

}


// ==========================================
// EMPLOYEE PROFILE
// ==========================================

app.get(
    "/api/profile",
    verifyToken,
    async (req, res) => {

        try {

            const employee =
                await Employee
                    .findById(req.employee.id)
                    .select("-password");


            if (!employee) {

                return res.status(404).json({
                    message:
                        "Employee not found"
                });

            }


            res.json(employee);

        }
        catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Error loading profile"
            });

        }

    }
);


// ==========================================
// ADD LEAVE
// ==========================================

app.post(
    "/api/leaves",
    verifyToken,
    async (req, res) => {

        try {

            const {
                date,
                reason,
                grant
            } = req.body;


            if (!date || !reason || !grant) {

                return res.status(400).json({
                    message:
                        "All fields are required"
                });

            }


            const employee =
                await Employee.findById(
                    req.employee.id
                );


            if (!employee) {

                return res.status(404).json({
                    message:
                        "Employee not found"
                });

            }


            const leave =
                new Leave({

                    employeeId:
                        employee._id,

                    empid:
                        employee.empid,

                    date:
                        date,

                    reason:
                        reason,

                    grant:
                        grant

                });


            await leave.save();


            res.status(201).json({

                message:
                    "Leave application added successfully",

                leave:
                    leave

            });

        }
        catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Error adding leave"
            });

        }

    }
);


// ==========================================
// LIST LEAVES
// ==========================================

app.get(
    "/api/leaves",
    verifyToken,
    async (req, res) => {

        try {

            const leaves =
                await Leave.find({

                    employeeId:
                        req.employee.id

                }).sort({

                    createdAt: -1

                });


            res.json(leaves);

        }
        catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Error loading leaves"
            });

        }

    }
);


// ==========================================
// SERVER
// ==========================================

app.listen(
    process.env.PORT,
    () => {

        console.log(
            `Backend running at http://localhost:${process.env.PORT}`
        );

    }
);