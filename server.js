const express = require('express');
const connectDB = require('./config/db'); // If you have this function already, you may not need this line
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose'); // Add this line

dotenv.config();

// MongoDB connection
const uri = process.env.MONGODB_URI; // Use the environment variable

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connection established');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
