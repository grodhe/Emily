const express = require("express");
const session = require('express-session');
const passport = require('passport');
const { getAccessToken } = require("./oauthClient");
const keys = require('./config/keys');
const mongoose = require('mongoose');
const { mongoData, getUserByEmail, User } = require('./mongo/mongoData');
//const MongoStore = require('connect-mongo');
const MongoStore = require('connect-mongo')(session);

const app = express();
const PORT = 5000;

let theUser = null;


async function fetchAccessToken() {
  try {
    const tokenResponse = await getAccessToken();
    console.log("Token Type:", tokenResponse.token_type);
    console.log("Expires In:", tokenResponse.expires_in);
    console.log("Scope:", tokenResponse.scope);

    return {
      access_token: tokenResponse.access_token,
      token_type: tokenResponse.token_type,
      expires_in: tokenResponse.expires_in,
      scope: tokenResponse.scope
    };
  } catch (err) {
    if (err.response) {
      console.error("OAuth error:", err.response.status, err.response.data);
    } else {
      console.error("Unexpected error:", err.message);
    }
    throw err;
  }
}

async function main() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(keys.mongoURI);
    console.log('MongoDB connected');

    // 2. Insert/fetch data
    await mongoData();

    // 3. Get user details
    const user = await getUserByEmail('emily@example.com');
    if (user) {
      console.log('---User details:', user);
      console.log('--Token:', user.token);
      theUser = user;
    } else {
      throw new Error('User not found');
    }

    console.log('*** Token:', theUser.token);

    // 4. MIDDLEWARE SETUP - CORRECT ORDER
    // Body parsers FIRST
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // express-session middleware BEFORE Passport
    app.use(
      session({
        secret: keys.sessionSecret || theUser.token, // Use a secure secret from keys
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create ? 
          // connect-mongo v4+ syntax
          MongoStore.create({
            mongoUrl: keys.mongoURI,
            touchAfter: 24 * 3600 // Lazy session update (seconds)
          }) :
          // connect-mongo v3 syntax
          new MongoStore({
            mongooseConnection: mongoose.connection,
            touchAfter: 24 * 3600
          }),
        cookie: {
          secure: false, // Set to true in production with HTTPS
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        }
      })
    );

    console.log('***express-session Created *******');

    // Passport middleware AFTER session
    app.use(passport.initialize());
    app.use(passport.session());

    console.log('*** passport.initialize(), passport.session() executed *******');

    // 5. ROUTES - Define routes after all middleware
    app.get("/", async (req, res) => {
      try {
        const tokenRespo = await fetchAccessToken();
        console.log("All went fine with token:", tokenRespo.access_token);
        res.json({
          hi: "there",
          tokenRespo,
          session: req.session.id // You can see the session ID
        });
      } catch (err) {
        res.status(500).json({
          error: "token_error"
        });
      }
    });

    // 6. START SERVER - After everything is configured
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Failed to initialize:', error);
    process.exit(1);
  }
}

main();