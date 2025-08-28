require("dotenv").config();
const nodemailer = require("nodemailer");

(async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"LMS" <${process.env.MAIL_USER}>`,
      to: "farazahmad102484@gmail.com",
      subject: "Test email from LMS",
      html: "<h2>Hello Faraz!</h2><p>This is a test email from LMS backend.</p>",
    });

    console.log("✅ Test email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Failed to send test email:", err);
  }
})();
