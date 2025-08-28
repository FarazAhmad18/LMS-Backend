exports.verificationTemplate = (verifyURL) => `
  <div style="font-family: sans-serif; padding: 10px;">
    <h2 style="color: #4CAF50;">Welcome to LMS!</h2>
    <p>Thank you for registering. Please click the button below to verify your email and activate your account:</p>
    <p>
      <a href="${verifyURL}" style="
        display: inline-block;
        padding: 10px 20px;
        color: white;
        background: #4CAF50;
        text-decoration: none;
        border-radius: 5px;
      ">Verify Now</a>
    </p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Best regards,<br/>LMS Team</p>
  </div>
`;
