const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({

    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },

    empid: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    reason: {
        type: String,
        required: true
    },

    grant: {
        type: String,
        enum: ["Yes", "No"],
        required: true
    }

}, {
    timestamps: true
});

module.exports =
    mongoose.model("Leave", leaveSchema);