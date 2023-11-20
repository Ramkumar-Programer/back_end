

const insertNewUserQuery = `
INSERT INTO userLogin(
    firstName, 
    lastName, 
    email, 
    password,
    verified) 
VALUES (?, ?, ?, ?,?)
`;

const selectUserQuery =`
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

const modifyOtpCheck = `UPDATE verifyUser
SET verified = ? WHERE emailId = ?`;

const modifyPasswordQuery = `UPDATE userLogin SET password = ? WHERE email = ?`;



module.exports = {
    insertNewUserQuery,
    selectUserQuery,
    createListTableQuery,
    createCardTableQuery,
    modifyPasswordQuery
};