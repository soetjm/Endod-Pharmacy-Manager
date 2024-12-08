const Sequelize = require('sequelize');
const sequelize = require("../utils/dbconnection.js")


const TransferLog = sequelize.define('TransferLog', {
    transferid: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true, // Assuming 'transferid' is the primary key
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
    unitcost: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
    },
    expirydate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    transferdate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    transferrequestno: {
        type: Sequelize.BIGINT,
        allowNull: false,
    },
    purchaseinvoiceno: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    purchasedate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    batchstatus: {
        type: Sequelize.STRING(20),
        defaultValue: 'active',
        allowNull: false,
        validate: {
            isIn: [['active', 'stockout', 'expired', 'transferred out', 'removed']], // Restricts values to specific options
        },
    },
    receivedby: {
        type: Sequelize.STRING(105),
        allowNull: false,
    },
    transferredfrom: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    transferredto: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    remark: {
        type: Sequelize.TEXT,
        allowNull: true, // Optional field
    },
}, {
    tableName: 'transferlog', // Specifies the table name
    schema: 'public', // Specifies the schema
    timestamps: false, // Disables createdAt and updatedAt
});

module.exports = TransferLog;