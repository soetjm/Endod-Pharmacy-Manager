const Sequelize = require('sequelize');
const sequelize = require("../utils/dbconnection.js");

const PurchaseRequest = sequelize.define('PurchaseRequest', {
    purchaserid: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true, // Assuming 'purchaserid' is the primary key
    },
    drugcode: {
        type: Sequelize.STRING(50),
        allowNull: false,
        primaryKey:true,
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
        allowNull: true, // This can be null if authorization is not yet done
    },
    suppliername: {
        type: Sequelize.STRING(80),
        allowNull: false,
    },
}, {
    tableName: 'purchaserequest', // Specifies the table name
    schema: 'public', // Specifies the schema
    timestamps: false, // Disables createdAt and updatedAt
});

module.exports = PurchaseRequest;