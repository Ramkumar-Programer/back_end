const express = require('express');
const otpRouter = express.Router();
const sendMail = require('./SendMail');



const dbConfig = require('../../Config/Config');
const {insertOpt, selectEmailOpt, deleteOptQueryAuto,deleteOptQuery, selectVerifedOpt, modifyOtpCheck} = require('../../Queries/Athu/OtpQueries');
const {executeQuery} = require('../../Queries/ExcuteQuery')


otpRouter.post('/sendOtp' , async (req, res) =>{

  console.log(" --- Came into /sendOtp ---")
  const result = await createdOtp(req.body.email_id);
  
  if(result.status === true)
  {
    console.log(" --- Otp is created and store into db ---")
    const data = await sendMail(req.body.email_id, result.otp);
    
    if(data.status)
    {
      console.log(" --- Otp is send to mailId ---")
      res.status(200).json({ status: true, message: "success" });
    }
    else
    {
      console.log(" --- Whiling sending otp got error ---")
      res.status(200).json({ status: false, message: "Otp is created but mail is not send so resend otp" });
    }
    
  }
  else
  {
    console.log(" --- Already otp is created ---")
    res.status(200).json({ status: false,code : 3 });
  }
    
  
})



otpRouter.post('/verfiyOtp' , async (req, res) =>{
  const mailId = req.body.email_id;
  const otp = req.body.otp;
  try {

    console.log(" --- Came into /verfiyOtp ---")
    const result = await executeQuery(dbConfig, selectEmailOpt, [mailId]);

    if (result.length > 0) {

      console.log(" --- Username is found ---")

     const storedOpt = result[0].otp;
    const createdAt = result[0].createdAt;

    const isExpired = new Date(createdAt.getTime() + 10 * 60 * 1000) < new Date();

    if (!isExpired) 
    {
      console.log(" --- Otp is not expired ---")
      if (storedOpt === otp) 
      {
        await executeQuery(dbConfig, modifyOtpCheck, [true, mailId]);
        console.log(" --- Otp is verfied ---")
        res.status(200).json({ status: true, message: 'Success' });
      }
      else 
      {
        console.log(" --- Otp is incorrect ---")
        res.status(200).json({ status: false, message: 'Incorrect OTP' });
      }
    } else {
      console.log(" --- Otp is expires ---")
      res.status(200).json({ status: false, message: 'OTP has expired' });
    }
      
    } else {
      console.log(" --- Email is not vaild ---")
      res.status(200).json({ status: false, message: 'Email is not vaild' });
    }
    //res.status(200).json({ exists: true, message: randomOTP });

  } 
  catch (error) {
    console.error("EmailId Exists error:", error);
    res.status(500).json("EmailId exists Api is failed");
  }

})



otpRouter.post('/reSendOtp', async(req, res)=>{
  const mail = req.body.email_id;
  console.log(" --- Came into /reSendOtp ---")
  const resultOtpDelete = await deleteOtp("delete", mail);

  if(resultOtpDelete.status === true)
  {
    console.log(" --- otp is deleted to resend ---")
      const result = await createdOtp(mail);

      if(result.status === true)
      {
        console.log(" --- new otp is created ---")
        const data = await sendMail(req.body.email_id, result.otp);
    
        if(data.status)
        {
          console.log(" --- Otp was send into mail ---")
          res.status(200).json({ status: true, message: "success" });
        }
        else
        {
          console.log(" --- Otp is created but mail is not send ---")
          res.status(200).json({ status: false, message: "Otp is created but mail is not send so resend otp" });
        }
      }
      else
      {
        console.log(" --- Resend Api is failed ---")
        res.status(200).json({ status: false, message: "EmailId exists Api is failed" });
      }
  }

})



otpRouter.post('/deleteOtp' , async (req, res) =>{

  console.log(" --- Came into /deleteOtp ---")
  const result = await deleteOtp("email",req.body.email_id);
  
  if(result.status === true)
  {
    console.log(" --- Otp is deleted successfully ---")
    res.status(200).json({ status: true, message: "success" });
  }
  else
  {
    console.log(" --- Otp is not deleted ---")
    res.status(200).json({ status: false, message: "EmailId exists Api is failed" });
  }
    
  
})



 async function deleteOtp(type, mail) {
  try {
    if (type === "auto") {
      const result = await executeQuery(dbConfig, selectVerifedOpt, [false]);
      //console.log(result)
      for(let i = 0; result.length > i; i++)
      {
        console.log(result[i].emailId)
        await executeQuery(dbConfig, deleteOptQueryAuto, result[i].emailId);
      }

      //console.log("inside auto")
    } else {
       executeQuery(dbConfig, deleteOptQuery, [mail]);
      // console.log("inside no auto");
    }

    // Successful deletion
    return { status: true, message: 'Deletion successful' };
  } catch (error) {
    console.error('Error during OTP deletion:', error);
    // Handle the error and return an appropriate response
    return { status: false, message: 'Error during OTP deletion' };
  }
}


async function createdOtp(mailId)
{
  const randomOTP = generateRandomOTP();

    try {
      const data = await executeQuery(dbConfig, selectEmailOpt, mailId);

      if(data.length === 0)
      {
        const result = await executeQuery(dbConfig, insertOpt, [mailId, randomOTP]);
        //console.log(result)
        return { status: true, otp : randomOTP};
      }
      return { status: false};

    } 
    catch (error) {
      console.error("EmailId Exists error:", error);
      return { status: false};
    }
}


  
function generateRandomOTP() {
  const length = 6;
  const characters = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters.charAt(randomIndex);
  }

  return otp;
  
}


module.exports =
{otpRouter,deleteOtp};