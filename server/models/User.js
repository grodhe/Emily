const mongoose = require('mongoose');
require('dotenv').config();
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
  clientID:  { type: String, required: true },
  googleId: String,
  createdAt: { type: Date, default: Date.now }
});

mongoose.model('user', userSchema);
