


// Create the userLogin table
const createUserLoginTableQuery = `
CREATE TABLE IF NOT EXISTS userLogin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    verified BOOLEAN  
)
`;

const createVerifyUserTable = `CREATE TABLE IF NOT EXISTS verifyUser (
    emailId VARCHAR(255) NOT NULL PRIMARY KEY,
    otp VARCHAR(6) NOT NULL,
    verified BOOLEAN,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `;

  module.exports = {
    createUserLoginTableQuery,
    createVerifyUserTable
  }