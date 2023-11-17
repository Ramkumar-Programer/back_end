//Config.js

const mySql = require('mysql2');

const dbConfig = mySql.createConnection({
    host : "beh45le33j6hw6iwj8r6-mysql.services.clever-cloud.com",
    port : 3306,
    user : "uukefphjyhdqc756",
    password : "tU2PbCGzJPupbBkxDok4",
    database : "beh45le33j6hw6iwj8r6"
});

module.exports = dbConfig;
