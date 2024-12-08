const Sequelize = require('sequelize');
const sequelize = require("../utils/dbconnection.js")

const UserAccount = sequelize.define('UserAccount', {
    username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        primaryKey: true,
    },
    password: {
        type: Sequelize.STRING(1000),
        allowNull: false,
    },
    datecreated: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    datemodified: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    accountstatus: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'active',
        validate: {
            isIn: [['active', 'disabled', 'deleted']],
        },
    },
}, {
    tableName: 'useraccount',
    schema: 'public',
    timestamps: false,
});

module.exports = UserAccount;