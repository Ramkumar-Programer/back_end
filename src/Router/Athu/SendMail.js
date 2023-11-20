const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_ID_PASS
  }
});

const sendMail = (mail, otp) => {
  //console.log(mail + "  " + otp);

  return new Promise((resolve, reject) => {
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject({ status: "false", message: 'Failed to send OTP' });
      } else {
        console.log("ready to send an email");
        const mailOptions = {
          to: mail,
          subject: 'OTP Verification',
          text: `
            This one-time OTP, please don't share it.
            Your OTP: ${otp}
            OTP will expire within 10 minutes
          `
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            reject({ status: "false", message: 'Failed to send OTP' });
          } else {
            console.log('Email sent: ' + info.response);
            resolve({ status: "true", message: 'OTP sent successfully' });
          }
        });
      }
    });
  });
};

module.exports = sendMail;
