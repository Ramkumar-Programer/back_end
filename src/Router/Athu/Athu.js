const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


const saltRounds = 7;


const dbConfig = require('../../Config/Config');
const {selectUserQuery, insertNewUserQuery, createListTableQuery, createCardTableQuery, modifyPasswordQuery} = require('../../Queries/Athu/AthuQueries');
const {selectEmailOpt} = require('../../Queries/Athu/OtpQueries');
const {executeQuery} = require('../../Queries/ExcuteQuery');
const {deleteOtp} = require('./Otp')

router.post('/login', async (req, res) => {
    try {
      console.log(" --- came into /login ---")
      const result = await executeQuery(dbConfig, selectUserQuery, [req.body.email_id]);
      
      if (result.length > 0) {
        console.log(" --- username is found ---")
        if(comparePasswords(req.body.password, result[0].password))
        {
          //console.log("Sucesss")
          console.log(" --- username and password is correct ---")
          res.status(200).json({ status: true, message: 'Sucesss', name : result[0].firstName+result[0].lastName });
        }
        else
        {
          console.log(" --- Password is inCorrect ---")
          res.status(200).json({ status: false, message: 'Password' });
        }
        
      } else {
        console.log(" --- Email is inCorrect ---")
        res.status(200).json({ status: false, message: 'Email' });
      }
    } catch (error) {
      console.error("EmailId Exists error:", error);
      res.status(500).json("EmailId exists Api is failed");
    }
});

router.post('/emailIdExists', async (req, res) => {
    try {
      console.log(" --- came into /emailIdExists ---")
      const result = await executeQuery(dbConfig, selectUserQuery, [req.body.email_id]);
      
      if (result.length > 0) {
        res.status(200).json({ exists: true, message: 'Email ID exists' });
        console.log(" --- Email ID exists ---")
      } else {
        
        res.status(200).json({ exists: false, message: 'Email ID does not exist' });
        console.log(" --- Email ID does not exists ---")
      }
    } catch (error) {
      console.error("EmailId Exists error:", error);
      res.status(500).json("EmailId exists Api is failed");
    }
});

router.post('/addUser', async  (req, res) =>{
    
    console.log(" --- come into /addUser ---")
    try{
      const result = await executeQuery(dbConfig, selectEmailOpt, [req.body.email_id]);
      
        if (result.length > 0) 
        {
          if(result[0].verified)
          {
                console.log(" --- user is verfied tries insert the data ---")
                const password = hashPassword(req.body.password);

                const tableListName = req.body.email_id.replace('@', '_').replace('.', '_') + '_list';
                const tableCardName = req.body.email_id.replace('@', '_').replace('.', '_') + '_card';
        
                await executeQuery(dbConfig, insertNewUserQuery, [req.body.first_name, req.body.last_name, req.body.email_id, password, true]);
                await executeQuery(dbConfig, createListTableQuery(tableListName));
                await executeQuery(dbConfig, createCardTableQuery(tableCardName, tableListName));
        
                // Send a success response
                res.status(200).json({ status: true, message: 'User registered successfully' });
                console.log(" --- user is created successfully ---")
                const deleteResult  = await deleteOtp("delete", req.body.email_id)
                if(deleteResult.status)
                {
                  console.log(" --- USer Otp deleted for creating---")
                }
                else
                {
                  console.log(" --- user is created and unable to delete the otp ---")
                }
                
          }
          else
          {
            res.status(200).json({ status: false, message: 'Otp is not verfied' });
            console.log(" --- user is not verfied ---")
          }
        }
        else
        {
          res.status(200).json({ status: false, message: 'Otp is not verfied' });
          console.log(" --- user is not verfied ---")
        }
    } catch (error) {
        console.error("Registration error:", error);
        // Send an error response
        res.status(500).json({ status: false, error: "Registration failed" });
    }
})

router.post('/forgotPassword', async  (req, res) =>{
    
    console.log(" --- come into /ForgotPassword ---")
    try{

      const result = await executeQuery(dbConfig, selectUserQuery, [req.body.email_id]);
      
      if (result.length > 0) 
      {
            const resultData = await executeQuery(dbConfig, selectEmailOpt, [req.body.email_id]);
          
            if (resultData.length > 0) 
            {
              if(resultData[0].verified)
              {
                    console.log(" --- user is verfied tries modify the data ---")
                    const password = hashPassword(req.body.password);
                    console.log(modifyPasswordQuery)
                    await executeQuery(dbConfig, modifyPasswordQuery, [password, req.body.email_id]);
            
                    // Send a success response
                    res.status(200).json({ status: true, message: 'Password is modifed successfully' });
                    console.log(" --- Password is modifed successfully ---")
                    const deleteResult  = await deleteOtp("delete", req.body.email_id)
                    if(deleteResult.status)
                    {
                      console.log(" --- USer Otp deleted for creating---")
                    }
                    else
                    {
                      console.log(" --- user is created and unable to delete the otp ---")
                    }
                    
              }
              else
              {
                res.status(200).json({ status: false, message: 'Otp is not verfied' });
                console.log(" --- user is not verfied ---")
              }
            }
            else
            {
              res.status(200).json({ status: false, message: 'Otp is not verfied' });
              console.log(" --- user is not verfied ---")
            }
      }
      else {
        console.log(" --- Emailid Doesn't registered ---")
        res.status(200).json({ status: false, message: `Emailid Doesn't registered` });
      }

      
    } catch (error) {
        console.error("Password modify error:", error);
        // Send an error response
        res.status(500).json({ status: false, error: "Password modify failed" });
    }
})


function hashPassword(password) {
    const pepperedPassword = password + process.env.SECRET_KEY;
    return bcrypt.hashSync(pepperedPassword, bcrypt.genSaltSync(saltRounds));
  
}

function comparePasswords(enteredPassword, hashedPassword) {
  return bcrypt.compareSync(enteredPassword + process.env.SECRET_KEY, hashedPassword);
}




module.exports = router;
