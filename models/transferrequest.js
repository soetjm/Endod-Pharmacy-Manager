const Sequelize = require('sequelize');
const sequelize = require("../utils/dbconnection.js")


const TransferRequest = sequelize.define('TransferRequest', {
    transferrid: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    drugcode: {
        type: Sequelize.STRING(50),
        allowNull: false,
        // primaryKey:true,
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
    transfertype: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['transferred in', 'transferred out']],
        },
    },
    transferredfrom: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    transferredto: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    purchasedate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        // primaryKey:true,
    },
    requestedby: {
        type: Sequelize.STRING(105),
        allowNull: false,
    },
    authorizedby: {
        type: Sequelize.STRING(105),
        allowNull: true,
    },
}, {
    tableName: 'transferrequest',
    schema: 'public',
    timestamps: false,
});

module.exports = TransferRequest;