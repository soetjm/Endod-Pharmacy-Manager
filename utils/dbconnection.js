const Sequelize = require('sequelize');
//ImportedPharam
const sequelize = new Sequelize('Pharmaciy','postgres','',{
    host:'localhost',
    dialect:'postgres'
})

module.exports = sequelize;
