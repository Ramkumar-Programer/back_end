// routes/athu/register.js

const express = require('express');
const router = express.Router();
const dbConfig = require('../../Config/Config');
const {insertNewUserQuery,createListTableQuery,createCardTableQuery,executeQuery, selectUserQuery} = require('../../Config/Queries')

router.post('/addUser', async  (req, res) =>{
    
    console.log(req.body)
    try{
        const password = hashPassword(req.body.password);

        const tableListName = req.body.email_id.replace('@', '_').replace('.', '_') + '_list';
        const tableCardName = req.body.email_id.replace('@', '_').replace('.', '_') + '_card';

        await executeQuery(dbConfig, insertNewUserQuery, [req.body.first_name, req.body.last_name, req.body.email_id, password]);
        await executeQuery(dbConfig, createListTableQuery(tableListName));
        await executeQuery(dbConfig, createCardTableQuery(tableCardName, tableListName));

     // Send a success response
     res.status(200).json({ status: true, message: 'User registered successfully' });
    } catch (error) {
        console.error("Registration error:", error);
        // Send an error response
        res.status(500).json({ status: false, error: "Registration failed" });
    }
})

router.post('/emailIdExists', async (req, res) => {
    console.log(req.body.email_id)
    try {
      const result = await executeQuery(dbConfig, selectUserQuery, [req.body.email_id]);
      console.log(result);
      if (result.length > 0) {
        // Email ID exists
        res.status(200).json({ exists: true, message: 'Email ID exists' });
      } else {
        // Email ID does not exist
        res.status(200).json({ exists: false, message: 'Email ID does not exist' });
      }
    } catch (error) {
      console.error("EmailId Exists error:", error);
      res.status(500).json("EmailId exists Api is failed");
    }
  });

router.post('/login', async (req, res) => {
    try {
      const result = await executeQuery(dbConfig, selectUserQuery, [req.body.email_id]);
      const password = await hashPassword(req.body.password);
      console.log(password)
      if (result.length > 0) {
      
        if(result[0].password === password)
        {
          res.status(200).json({ status: true, message: 'Sucesss', name : result[0].firstName+result[0].lastName });
        }
        else
        {
          res.status(200).json({ status: false, message: 'Incorrect Password' });
        }
        
      } else {
        // Email ID does not exist
        res.status(200).json({ status: false, message: 'Email Id is not exists' });
      }
    } catch (error) {
      console.error("EmailId Exists error:", error);
      res.status(500).json("EmailId exists Api is failed");
    }
  });


function hashPassword(password) {
    const saltRounds = 7; // Adjust as needed
    const salt = crypto.randomBytes(16).toString('hex'); // CSPRNG for salt
    const pepperedPassword = password + process.env.SECRET_KEY; // Combine password with secret key
    return bcrypt.hashSync(pepperedPassword, bcrypt.genSaltSync(saltRounds));
  
}
module.exports = router;
