const Sequelize = require('sequelize');
const sequelize = require("../utils/dbconnection.js")

const Employee = sequelize.define('Employee', {
    eid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, // Assuming 'eid' is the primary key
    },
    firstname: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    lastname: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    dob: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    subcity: {
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    woreda: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    houseno: {
        type: Sequelize.STRING(10),
        allowNull: false,
    },
    phonenumber: {
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    username: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
}, {
    tableName: 'employee', // Match the table name in the database
    schema: 'public', // Specify the schema if needed
    timestamps: false, // Assuming no createdAt or updatedAt columns
});

module.exports = Employee;