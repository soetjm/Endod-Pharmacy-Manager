const Sequelize = require('sequelize');
const sequelize = require("../utils/dbconnection.js");
const Dispensary = require('./dispensary.js');

const StockRequest = sequelize.define('StockRequest', {
    stockrid: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    drugcode: {
        type: Sequelize.STRING(50),
        allowNull: false,
        // reference:{
        //     model:'Dispensary',
        //     key:'drugcode'
        // }
    },
    quantityrequested: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    quantityremaining: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    unit: {
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    issuetype: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['issue in', 'issue out']], // Restricts values to 'issue in' or 'issue out'
        },
    },
    requesteddate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    requestedby: {
        type: Sequelize.STRING(105),
        allowNull: false,
    },
    authorizedby: {
        type: Sequelize.STRING(105),
        allowNull: true, // This can be null if no authorization is provided
    },
}, {
    tableName: 'stockrequest', // Specifies the table name
    schema: 'public', // Specifies the schema
    timestamps: false, // Disables createdAt and updatedAt
});

module.exports = StockRequest;