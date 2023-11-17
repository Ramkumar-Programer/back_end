//Config.js

const mySql = require('mysql2');

const dbConfig = mySql.createConnection({
    host : "localhost",
    port : 3306,
    user : "root",
    password : "root",
    database : "cardsboard"
});

module.exports = dbConfig;