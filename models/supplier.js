const Sequelize = require('sequelize');
const sequelize = require("../utils/dbconnection.js")


const Supplier = sequelize.define('Supplier', {
    supplierid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, // Assuming 'supplierid' is the primary key
    },
    suppliername: {
        type: Sequelize.STRING(80),
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
        allowNull: true, // This field is optional
    },
    supplierstatus: {
        type: Sequelize.STRING(20),
        defaultValue: 'active',
        allowNull: false,
        validate: {
            isIn: [['active', 'inactive']], // Restricts values to 'active' or 'inactive'
        },
    },
}, {
    tableName: 'supplier', // Specifies the table name
    schema: 'public', // Specifies the schema
    timestamps: false, // Disables createdAt and updatedAt
});

module.exports = Supplier;