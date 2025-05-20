// backend/routes/emailRoutes.js

const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/send-report', async (req, res) => {
  const { email, reportLink } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password'
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Your Report Download Link',
    text: `Download your report here: ${reportLink}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

module.exports = router;
