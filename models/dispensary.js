const Sequelize = require('sequelize');
const sequelize = require("../utils/dbconnection.js");
const StockRequest = require('./stockrequest.js');

const Dispensary = sequelize.define('Dispensary', {
    dispid: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true, // A
    },
    drugcode: {
        type: Sequelize.STRING(50),
        allowNull: false,
        // reference:{
        //     model:'StockRequest',
        //     key:'drugcode'
        // }
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
        reference:{
            model:'StockRequest',
            key:'stockrid'
        }

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
    tableName: 'dispensary', 
    schema: 'public',
    timestamps: false,});

module.exports = Dispensary;
