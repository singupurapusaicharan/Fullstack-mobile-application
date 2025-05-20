// backend/config/db.js

const mysql = require('mysql2');
// Load environment variables
// require('dotenv').config();


const db = mysql.createConnection({
  host: '192.168.29.170',
  user: 'root', // Replace with your MySQL username
  password: 'Saya@090723', // Replace with your MySQL password
  database: 'native_app'
});


db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = db;
