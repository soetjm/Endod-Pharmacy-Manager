const Sequelize = require('sequelize');
const sequelize = require("../utils/dbconnection.js")


const UserLog = sequelize.define('UserLog', {
    username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        primaryKey:true,
    },
    operationtype: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    operationtime: {
        type: Sequelize.DATE,
        allowNull: false,
        primaryKey:true,
    },
}, {
    tableName: 'userlog',
    schema: 'public',
    timestamps: false,
});

module.exports = UserLog;