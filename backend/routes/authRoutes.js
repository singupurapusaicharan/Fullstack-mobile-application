// backend/routes/authRoutes.js


// // Load environment variables
// require('dotenv').config();


const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const nodemailer = require('nodemailer');
const router = express.Router();


// Set up nodemailer transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Or use 'smtp' settings as needed
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    
  },
  logger: true, // Enable logging
  debug: true,  // Show detailed output in console
});


// // Log email credentials for debugging
// console.log('Email User:', process.env.EMAIL_USER);
// console.log('Email Pass:', process.env.EMAIL_PASS);


// Sign up route with OTP generation
router.post('/signup', async (req, res) => {
  const { username, email, password, phone } = req.body;

  console.log("Received signup request:", { username, email, phone });

  // Check if account already exists
  db.query('SELECT * FROM signup WHERE username = ? OR email = ?', [username, email], async (err, results) => {
    if (err) {
      console.error("Error in SELECT query:", err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      console.log("Account already exists for:", { username, email });
      return res.status(400).json({ message: 'Account already exists' });
    }

    // Hash the password and generate OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    // const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    // const otpExpiry = new Date(Date.now() + 10 * 60000); // OTP expires in 10 minutes

    // Insert user into database
    db.query(
      'INSERT INTO signup (username, email, password, phone) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, phone],
      (err, results) => {
        if (err) {
          console.error("Error in INSERT query:", err);
          return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json({ message: 'Account created. Proceed to OTP verification.', email });
      }
    );
  });
});

// Route to send OTP email
router.post('/send-otp', (req, res) => {
  const { email } = req.body;
  
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60000); // OTP expires in 10 minutes

  db.query(
    'UPDATE signup SET otp_code = ?, otp_expiry = ? WHERE email = ?',
    [otpCode, otpExpiry, email],
    async (err, results) => {
      if (err) {
        console.error("Error updating OTP in database:", err);
        return res.status(500).json({ message: 'Database error' });
      }

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Your One-Time Password (OTP) for Account Verification',
          text: `
      Dear User,
      
      Thank you for signing up with us. To complete your registration, please verify your email address using the One-Time Password (OTP) provided below. This code will expire in 10 minutes.
      
      **Your OTP Code:** ${otpCode}
      
      Please enter this code in the verification field to complete your signup process.
      
      If you did not initiate this request, please disregard this email.
      
      Best regards,
      **** Support Team
      Contact Us: ****
      Visit Us: ****
      
      Note: This is an automated email, please do not reply to this message.
      `,
        });
        console.log("OTP sent to email:", email);
        res.status(200).json({ message: 'OTP sent to your email.' });
      } catch (error) {
        console.error("Error sending OTP email:", error);
        res.status(500).json({ message: 'Failed to send OTP email' });
      }
      
    }
  );
});


// OTP verification route
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  console.log("OTP verification request:", { email, otp });

  // Check OTP
  db.query(
    'SELECT * FROM signup WHERE email = ? AND otp_code = ? AND otp_expiry > NOW()',
    [email, otp],
    (err, results) => {
      if (err) {
        console.error("Database error during OTP verification:", err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (results.length > 0) {
        console.log("OTP verified successfully for email:", email);
        res.status(200).json({ message: 'OTP verified successfully' });
      } else {
        console.log("Invalid or expired OTP for email:", email);
        res.status(400).json({ message: 'Invalid or expired OTP' });
      }
    }
  );
});



router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  // Query to select user by email
  db.query('SELECT id, email, password FROM signup WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error("Error in SELECT query:", err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Check if user exists
    if (results.length === 0) {
      return res.status(400).json({ message: 'No account created with this email.' });
    }

    const user = results[0];

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Successful login - return userId and success message
    res.status(200).json({ message: 'Login successful', userId: user.id }); 
    console.log('Query results:', results); // Log the results from the database query// Ensure this matches your database schema
  });
});


// Save Report Route
router.post('/save-report', async (req, res) => {

  const { userId, reportData } = req.body;
  console.log("Received request to save report:", { userId, reportData });

  db.query('INSERT INTO reports (user_id, report_data) VALUES (?, ?)', [userId, JSON.stringify(reportData)], (err, results) => {
      if (err) {
          console.error("Error saving report:", err);
          return res.status(500).json({ message: 'Database error' });
      }
      console.log("Report saved successfully:", results);
      res.status(200).json({ message: 'Report saved successfully' });
  });
});


// Load Report Route
router.post('/load-report', (req, res) => {
  const { userId } = req.body;
  console.log("Received request to load report for userId:", userId);
  db.query('SELECT report_data FROM reports WHERE user_id = ? ORDER BY id DESC LIMIT 1', [userId], (err, results) => {

  console.log("Query results:", results); // Log results to see what is returned
      if (err) {
          console.error("Error loading report:", err);
          return res.status(500).json({ message: 'Database error' });
      }
      if (results.length > 0) {
          console.log("Report data found:", results[0].report_data);
          res.status(200).json({ reportData: JSON.parse(results[0].report_data) });
      } else {
          console.log("No report found for userId:", userId);
          res.status(404).json({ message: 'No report found' });
      }
  });
});


module.exports = router;



