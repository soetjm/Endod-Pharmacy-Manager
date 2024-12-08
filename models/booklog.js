
const Sequelize = require('sequelize');
const sequelize = require("../utils/dbconnection.js")
const Sales = require('./sales.js');

const BookLog = sequelize.define('booklog', {
    booklogid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    salesid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      reference:{
        model:Sales,
        key:'salesid'
      }
      
    },
    drugcode: {
      type: Sequelize.STRING(50),
      allowNull: false,
      reference:{
        model:Sales,
        key:'drugcode'
      }
    },
    customerfname: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    customerlname: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    gender: {
      type: Sequelize.STRING(7),
      allowNull: false,
      validate: {
        isIn: [['male', 'female']],
      },
    },
    age: {
      type: Sequelize.REAL,
      allowNull: false,
    },
    cardno: {
      type: Sequelize.STRING(20),
      allowNull: true,
    },
    prescriptiontype: {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['narcotic', 'psychotropic', 'other']],
      },
    },
    prescriptionserialno: {
      type: Sequelize.STRING(20),
      allowNull: true,
    },
    prescribeddate: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    prescriberaddress: {
      type: Sequelize.STRING(80),
      allowNull: false,
    },
  }, {
    tableName: 'booklog',
    schema: 'public', // 
    timestamps: false, //
    indexes: [
      {
        unique: false,
        fields: ['gender'],
        where: {
          gender: ['male', 'female'],
        },
      },
      {
        unique: false,
        fields: ['prescriptiontype'],
        where: {
          prescriptiontype: ['narcotic', 'psychotropic', 'other'],
        },
      },
    ],
});

// sequelize.sync({ force: true });





module.exports = BookLog;
