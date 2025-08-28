// const nodemailer=require("nodemailer")

// module.exports=async(to,subject,html)=>
// {
// const transporter=nodemailer.createTransport({
//     service:"gmail",
//     auth:{
// user:process.env.MAIL_USER,
// pass:process.env.MAIL_PASS,
//     }}
// )
// await transporter.sendMail({
//         from: `"LMS" <${process.env.MAIL_USER}>`,
//     to,subject,html

// })
// }

const nodemailer = require("nodemailer");

module.exports = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,          // smtp.gmail.com
    port: 465,                            // secure port
    secure: true,                         // use SSL
    auth: {
      user: process.env.MAIL_USER,        // your gmail address
      pass: process.env.MAIL_PASS         // app password
    }
  });

  try {
    await transporter.sendMail({
      from: `"LMS" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};
