const Sequelize = require('sequelize');
const sequelize = require("../utils/dbconnection.js")

const UserRole = sequelize.define('UserRole', {
    username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        primaryKey:true,
    },
    role: {
        type: Sequelize.STRING(20),
        allowNull: false,
        primaryKey:true,
        validate: {
            isIn: [['pharmacy manager', 'storekeeper', 'pharmacist']], // Ensures valid role
        },
    },
    rolestatus: {
        type: Sequelize.STRING(20),
        defaultValue: 'active',
        allowNull: false,
        validate: {
            isIn: [['active', 'disabled']], // Ensures valid role status
        },
    },
}, {
    tableName: 'userrole',
    schema: 'public',
    timestamps: false,
});

module.exports = UserRole;
