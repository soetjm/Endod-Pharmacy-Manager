const Sequelize = require('sequelize');
const sequelize = require("../utils/dbconnection.js")


const DisposableMedicine = sequelize.define('DisposableMedicine', {
    did: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true, // Assuming 'did' is the primary key
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
    damagetype: {
        type: Sequelize.STRING(15),
        allowNull: false,
        defaultValue: 'damaged',
        validate: {
            isIn: [['damaged', 'expired', 'other']],
        },
    },
    damagedfrom: {
        type: Sequelize.STRING(15),
        allowNull: false,
        validate: {
            isIn: [['store', 'dispensary']],
        },
    },
    damagedate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    damagestatus: {
        type: Sequelize.STRING(15),
        allowNull: false,
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'approved', 'rejected']],
        },
    },
    reportedby: {
        type: Sequelize.STRING(105),
        allowNull: false,
    },
    remark: {
        type: Sequelize.TEXT,
    },
}, {
    tableName: 'disposablemedicine', // Match the table name in the database
    schema: 'public', // Specify the schema if needed
    timestamps: false, // Assuming no createdAt or updatedAt columns
});

module.exports = DisposableMedicine;