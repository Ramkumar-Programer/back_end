//DbConnection.js

const dbConfig = require('./Config');
const { executeQuery, createUserLoginTableQuery } = require('./Queries');

function connectAndInitializeDatabase() {

    dbConfig.connect((err) => {
        if (err) {
            console.error('Error connecting to the database: ', err);
            return;
        }

        console.log('Connected to the database');

        executeQuery(dbConfig, createUserLoginTableQuery, [])
            .then((result) => {
                console.log('Query result:', result);
            })
            .catch((error) => {
                console.error('Query error:', error);
            });
    });
    
}

module.exports = connectAndInitializeDatabase;
