const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({

    empid: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    basicSalary: {
        type: Number,
        required: true
    },

    hra: {
        type: Number,
        required: true
    },

    da: {
        type: Number,
        required: true
    },

    totalSalary: {
        type: Number,
        required: true
    },

    password: {
        type: String,
        required: true
    }

});

module.exports =
    mongoose.model("Employee", employeeSchema);