const sendEmail = require("../utils/sendEmail");

exports.contactSupport = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: "Subject and message are required." });
    }

    await sendEmail(
      process.env.SUPPORT_EMAIL, // e.g., support@seekio.com
      subject,
      `<p>User: ${req.user.email}</p><p>${message}</p>`
    );

    res.json({ success: true, message: "Message sent to support." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
};
