const express = require("express");
const cors = require("cors");

const sequelize = require("./database");
const Student = require("./models/Student");

const app = express();

const PORT = 5003;

app.use(cors());
app.use(express.json());


// HOME
app.get("/", (req, res) => {
    res.send("Q8 Student CRUD API is Running");
});


// CREATE
app.post("/api/students", async (req, res) => {
    try {
        const {
            name,
            email,
            course,
            age,
            city
        } = req.body;

        if (!name || !email || !course || !age || !city) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const student = await Student.create({
            name,
            email,
            course,
            age,
            city
        });

        res.status(201).json(student);
    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error creating student",
            error: error.message
        });
    }
});


// READ ALL
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.findAll({
            order: [["id", "ASC"]]
        });

        res.json(students);
    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error fetching students",
            error: error.message
        });
    }
});


// READ ONE
app.get("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);
    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error fetching student",
            error: error.message
        });
    }
});


// UPDATE
app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const {
            name,
            email,
            course,
            age,
            city
        } = req.body;

        await student.update({
            name,
            email,
            course,
            age,
            city
        });

        res.json(student);
    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error updating student",
            error: error.message
        });
    }
});


// DELETE
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        await student.destroy();

        res.json({
            message: "Student deleted successfully"
        });
    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error deleting student",
            error: error.message
        });
    }
});


// START SERVER
async function startServer() {
    try {
        await sequelize.authenticate();

        console.log("SQLite Connected");

        await sequelize.sync();

        console.log("Student table ready");

        app.listen(PORT, () => {
            console.log(
                `Backend running at http://localhost:${PORT}`
            );
        });
    }
    catch (error) {
        console.log("Database Error:");
        console.log(error.message);
    }
}

startServer();