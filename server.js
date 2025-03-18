const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Enhanced CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// MongoDB connection with improved options
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User schema with enhanced validation
const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: [true, "Firebase UID is required"],
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  photoUrl: String,
  authProvider: {
    type: String,
    required: true,
    enum: ["google", "email"],
  },
  gender: {
    type: String,
    enum: ["male", "female", "other", null],
    default: null,
  },
  age: {
    type: Number,
    min: [13, "Minimum age is 13"],
    max: [120, "Maximum age is 120"],
  },
  height: Number,
  heightImperial: {
    feet: Number,
    inches: Number,
  },
  currentWeight: Number,
  goalWeight: Number,
  goalType: String,
  weightDifference: Number,
  weightChangeSpeed: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes
userSchema.index({ uid: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// User routes with enhanced validation
app.post("/api/users", async (req, res) => {
  try {
    const existingUser = await User.findOne({ uid: req.body.uid });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = new User({
      ...req.body,
      createdAt: new Date(),
    });

    await user.validate();
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        details: Object.values(error.errors).map((e) => e.message),
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/users/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid })
      .select("-__v -_id")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/users/:uid", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { uid: req.params.uid },
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        details: Object.values(error.errors).map((e) => e.message),
      });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
