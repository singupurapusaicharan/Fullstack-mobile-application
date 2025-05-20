// backend/index.js

require('dotenv').config();  // Load environment variables at the top

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const app = express();
// const emailRoutes = require('./routes/emailRoutes');


app.use(cors());


// app.use('/email', emailRoutes);

app.use(bodyParser.json());

app.use('/auth', authRoutes);

app.listen(5000, () => {
  console.log('Server running on http://192.168.29.170:5000');
});



