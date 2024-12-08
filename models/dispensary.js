const Sequelize = require('sequelize');
const sequelize = require("../utils/dbconnection.js")

const Dispensary = sequelize.define('Dispensary', {
    dispid: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true, // Assuming this is the primary key.
    },
    drugcode: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    batchno: {
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
        allowNull: false,
    },
    expirydate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    issueddate: {
        type: Sequelize.DATEONLY,   
        allowNull: false,
    },
    stockrequestno: {
        type: Sequelize.BIGINT,
        allowNull: false,
    },
    batchstatus: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'active',
        validate: {
            isIn: [['active', 'stockout', 'expired', 'removed']],
        },
    },
    issuestatus: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'in store',
        validate: {
            isIn: [['in store', 'returned']],
        },
    },
    receivedby: {
        type: Sequelize.STRING(105),
        allowNull: false,
    },
    deliveredby: {
        type: Sequelize.STRING(105),
        allowNull: false,
    },
    remark: {
        type: Sequelize.TEXT,
    },
}, {
    tableName: 'dispensary', // Match the table name in the database
    schema: 'public', // Specify the schema
    timestamps: false, // Assuming no createdAt or updatedAt columns
});

module.exports = Dispensary;
