const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const connectDB = require('./config/db'); 

const cors = require('cors');
const mongoose = require('mongoose');
const Workout = require('./models/workout.model.js');

// Load environment variables


// Initialize express app
const app = express();

// MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS
app.use(cors());

// Connect to MongoDB
console.log('MongoDB URI:', process.env.MONGODB_URI);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connection established');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// GET all workouts
app.get("/api/workouts", async (req, res) => {
  try {
    const workouts = await Workout.find({});
    res.status(200).json({ success: true, data: workouts });
  } catch (error) {
    console.log("Error in fetching workouts:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// POST a new workout
app.post('/api/workouts', async (req, res) => {
  const workout = req.body;

  if (!workout.name || !workout.duration || !workout.date) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  const newWorkout = new Workout(workout);
  try {
    await newWorkout.save();
    res.status(201).json({ success: true, data: newWorkout });
  } catch (error) {
    console.error("Error in creating workout:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// DELETE a workout by ID
app.delete("/api/workouts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Workout.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Workout deleted" });
  } catch (error) {
    res.status(404).json({ success: false, message: "Workout not found" });
  }
});
mongoose.connection.once('open', async () => {
    try {
        await mongoose.connection.db.collection('workouts').dropIndex('workoutName_1');
        console.log('Dropped index: workoutName_1');
    } catch (err) {
        console.error('Error dropping index:', err);
    }
});


// Auth and user routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
