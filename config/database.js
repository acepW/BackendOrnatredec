const {Sequelize} = require('sequelize');

// const database_name = process.env.DB_NAME;
// const password = process.env.PASSWORD;
// const username = process.env.USERNAME;
// const host = process.env.HOST;

const database_name = "bigornat";
const password = '';
const username = 'root';
const host = 'localhost';

const sequelize = new Sequelize (database_name, username,  password,{ 
    host : host,
    dialect : 'mysql'
})

module.exports = sequelize;