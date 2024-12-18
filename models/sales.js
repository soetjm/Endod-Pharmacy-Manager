const Sequelize = require('sequelize');
const sequelize = require("../utils/dbconnection.js");
const Medicine = require('./medicine.js');
const BookLog = require('./booklog.js');

const Sales = sequelize.define('Sales', {
    salesid: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true, 
    },
    drugcode: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    unit: {
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    unitsellingprice: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true, // This can be null if no price is provided
    },
    salesdate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    dispensedby: {
        type: Sequelize.STRING(105),
        allowNull: true, // This can be null if no dispenser is assigned
    },
    salesstatus: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'sold', // Default value set to 'sold'
        validate: {
            isIn: [['sold', 'returned']], // Restricts values to 'sold' or 'returned'
        },
    },
}, {
    tableName: 'sales', 
    schema: 'public', 
    timestamps: false, 
    indexes: [
        {
            unique: true,
            fields: ['salesid', 'drugcode'], // Composite key
        },
    ],
});

  

module.exports = Sales;