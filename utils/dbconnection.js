const Sequelize = require('sequelize');
const config = require('../config/config.json');

const CONN = config[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(CONN["database"],CONN["username"],CONN["password"],{
    host: CONN["host"],
    port: CONN["port"],
    dialect:CONN["dialect"]
})

module.exports = sequelize;
