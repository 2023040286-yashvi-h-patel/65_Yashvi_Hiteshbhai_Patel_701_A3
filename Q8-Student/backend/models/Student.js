const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Student = sequelize.define(
    "Student",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false
        },

        course: {
            type: DataTypes.STRING,
            allowNull: false
        },

        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        city: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "students",
        timestamps: false
    }
);

module.exports = Student;