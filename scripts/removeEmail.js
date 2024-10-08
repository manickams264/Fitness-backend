const mongoose = require('mongoose');
const User = require('./models/User');

const uri = process.env.MONGODB_URI; 

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('MongoDB connection established');
        await User.updateMany({}, { $unset: { email: "" } });
        console.log('Email field removed from all users.');
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
