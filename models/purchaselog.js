const Sequelize = require('sequelize');
const sequelize = require("../utils/dbconnection.js");

const PurchaseLog = sequelize.define('PurchaseLog', {
    purchaseid: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true, // Assuming 'purchaseid' is the primary key
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
    purchasedate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    purchaserequestno: {
        type: Sequelize.BIGINT,
        allowNull: false,
        reference:{
            model:'PurchaseRequest',
            key:'purchaserid'
        }
    },
    purchaseinvoiceno: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    batchstatus: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'active',
        validate: {
            isIn: [['active', 'stockout', 'expired', 'removed']], // Enforces the CHECK constraint
        },
    },
    receivedby: {
        type: Sequelize.STRING(105),
        allowNull: false,
    },
    remark: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'purchaselog', // Specifies the table name
    schema: 'public', // Specifies the schema
    timestamps: false, // Disables createdAt and updatedAt
});




module.exports = PurchaseLog;