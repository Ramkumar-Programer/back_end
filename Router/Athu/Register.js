// routes/athu/register.js

const express = require('express');
const router = express.Router();
const dbConfig = require('../../Config/Config');
const {insertNewUserQuery,createListTableQuery,createCardTableQuery,executeQuery, selectUserQuery} = require('../../Config/Queries')


router.post('/addUser', async  (req, res) =>{
    try{
        const tableListName = req.body.email_id.replace('@', '_').replace('.', '_') + '_list';
        const tableCardName = req.body.email_id.replace('@', '_').replace('.', '_') + '_card';

        await executeQuery(dbConfig, insertNewUserQuery, [req.body.first_name, req.body.last_name, req.body.email_id, req.body.password]);
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
    try {
      const result = await executeQuery(dbConfig, selectUserQuery, [req.body.email_id]);
      
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

module.exports = router;
