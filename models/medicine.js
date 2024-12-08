const Sequelize = require('sequelize');
const sequelize = require("../utils/dbconnection.js");
const Sales = require('./sales.js');


const Medicine = sequelize.define('Medicine', {
    drugcode: {
        type: Sequelize.STRING(50),
        allowNull: false,
        primaryKey: true, // Assuming 'drugcode' is the unique identifier
    },
    genericname: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    brandname: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    dosage: {
        type: Sequelize.STRING(15),
        allowNull: false,
    },
    formulation: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    classification: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    unit: {
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    unitsellingprice: {
        type: Sequelize.DECIMAL(15, 2), // Maps to numeric(15,2) in PostgreSQL
        allowNull: true,
    },
    sharestatus: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: 'not shared',
        validate: {
            isIn: [['shared', 'not shared']], // Maps the CHECK constraint
        },
    },
    drugstatus: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: 'active',
        validate: {
            isIn: [['active', 'inactive']], // Maps the CHECK constraint
        },
    },
}, {
    tableName: 'medicine', // Explicitly specify the table name
    schema: 'public', // Specify the schema if necessary
    timestamps: false, // Disable createdAt and updatedAt
});






module.exports = Medicine;