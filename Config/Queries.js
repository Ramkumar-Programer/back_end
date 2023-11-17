//Quries.js


// Create the userLogin table
const createUserLoginTableQuery = `
CREATE TABLE IF NOT EXISTS userLogin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
)
`;

const insertNewUserQuery = `
INSERT INTO userLogin(
    firstName, 
    lastName, 
    email, 
    password) 
VALUES (?, ?, ?, ?)
`;

const selectAllUserQuery = `
SELECT * FROM userLogin 
where email = ? and password = ?
`;

const selectUserQuery =
`
SELECT * FROM userLogin 
where email = ?
`;

const createListTableQuery = (tableName) => `
CREATE TABLE IF NOT EXISTS ${tableName} (
    listId INT PRIMARY KEY AUTO_INCREMENT,
    listName VARCHAR(255),
    userName VARCHAR(255),
    FOREIGN KEY (userName) REFERENCES userLogin(email) ON DELETE CASCADE
)
`;


const createCardTableQuery = (tableName, tableListName) => `
CREATE TABLE IF NOT EXISTS ${tableName} (
    cardId INT PRIMARY KEY AUTO_INCREMENT,
    cardName VARCHAR(255),
    cardContent TEXT,
    listId INT,
    FOREIGN KEY (listId) REFERENCES ${tableListName}(listId) ON DELETE CASCADE
)
`;

async function executeQuery(db, query, params = []) {
    
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = {
    createUserLoginTableQuery,
    insertNewUserQuery,
    selectAllUserQuery,
    selectUserQuery,
    createListTableQuery,
    createCardTableQuery,
    executeQuery
};
