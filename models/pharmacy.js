const Sequelize = require('sequelize');
const sequelize = require("../utils/dbconnection.js");

const Pharmacy = sequelize.define('Pharmacy', {
    pid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, // Assuming 'pid' is the primary key
    },
    pharmacyname: {
        type: Sequelize.STRING(80),
        allowNull: false,
    },
    branchname: {
        type: Sequelize.STRING(30),
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
    pharmacystatus: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: 'active',
        validate: {
            isIn: [['active', 'inactive']], // Maps to the CHECK constraint
        },
    },
}, {
    tableName: 'pharmacy', // Specify the table name
    schema: 'public', // Specify the schema
    timestamps: false, // Disable createdAt and updatedAt
});

module.exports = Pharmacy;