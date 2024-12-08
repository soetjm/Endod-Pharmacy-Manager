const Sequelize = require('sequelize');

const sequelize = new Sequelize('Pharmaciy','postgres','',{
    host:'localhost',
    dialect:'postgres'
})

module.exports = sequelize;
