const Sequelize = require('sequelize');

const sequelize = new Sequelize('Pharmaciy','postgres','11141994so',{
    host:'localhost',
    dialect:'postgres'
})

module.exports = sequelize;