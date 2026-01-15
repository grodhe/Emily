const passport = require('passport');
const mongoose = require('mongoose');
const keys = require('../config/keys');
const userSchema= require('../models/User');



  module.exports = app => {
  app.get('/api/user', async (req, res) => {
  try {
    await mongoose.connect(keys.mongoURI);
    const user = await User.findOne({ email: "emily@example.com" });
      if (user) {
      res.send(user);
      console.log("** User: ", user)
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
  });
};


/*
   app.get('/api/logout', (req, res) => {
    req.logout();
    res.send(req.user);
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });

 */ 

