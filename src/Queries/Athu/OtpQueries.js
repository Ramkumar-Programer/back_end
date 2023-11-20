

const insertOpt = `INSERT INTO 
verifyUser (emailId, otp, createdAt, verified)
 VALUES (?, ?, NOW(), false)`;


 const modifyOtpCheck = `UPDATE verifyUser
 SET verified = ? WHERE emailId = ?`;


 const selectEmailOpt = `SELECT * FROM verifyUser WHERE emailId = ?`;
 const selectVerifedOpt = `SELECT * FROM verifyUser WHERE verified = ?`;

 const deleteOptQueryAuto = `DELETE FROM verifyUser 
 WHERE emailId = ? AND TIMESTAMPDIFF(MINUTE, createdAt, NOW()) >= 10`;

 const deleteOptQuery = 'DELETE FROM verifyUser WHERE emailId = ?';

 module.exports = {
    insertOpt,
    selectEmailOpt,
    deleteOptQueryAuto,
    deleteOptQuery,
    selectVerifedOpt,
    modifyOtpCheck
};