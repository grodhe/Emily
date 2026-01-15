// insertData.js - MongoDB data insertion module
require('dotenv').config();
const mongoose = require('mongoose');
const keys = require('../config/keys');
const { getAccessToken } = require("../oauthClient");

// Define a sample schema (adjust based on your needs)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
  token:  { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Sample data to insert
const sampleUsers = [
  { name: 'Emily Johnson', email: 'emily@example.com',age: 25 ,token:0}//,
//  { name: 'John Doe', email: 'john@example.com',age: 30 ,token:0},
//  { name: 'Jane Smith', email: 'jane@example.com', age: 28,token:0}
];



async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ email: email });
    
    if (user) {
      console.log(`✅ User found: ${user.name}`);
      return user;
    } else {
      console.log(`❌ No user found with email: ${email}`);
      return null;
    }
  } catch (error) {
    console.error('❌ Error finding user:', error.message);
    throw error;
  }
}


// Method 1: Update all users sequentially with incremental tokens
async function updateAllTokensSequential() {
  const users = sampleUsers;

  for (let i = 0; i < users.length; i++) {
    const tokenResponse = await getAccessToken();
    const user = users[i];
    user.token = tokenResponse.access_token; // 10, 20, 30, etc.
    console.log("**** All went fine with token:", tokenResponse.access_token);
    console.log(`✅ Updated ${user.name} - Token: ${user.token}`);
  }
  return users.length;
}

// Main function to insert data
async function mongoData() {
  try {
    // Connect to MongoDB
//    await mongoose.connect(keys.mongoURI);
    console.log('✅ MongoDB Connected Successfully');

    // Clear existing data (optional - remove if you want to keep existing data)
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    await updateAllTokensSequential();

    // Insert sample data
    const result = await User.insertMany(sampleUsers);
    console.log(`✅ Inserted ${result.length} users successfully:`);
    console.log(result);

    // Query to verify
    const allUsers = await User.find({});
    console.log('\n📋 All users in database:');
    allUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    // Close connection
//    await mongoose.connection.close();
    console.log('\n🔌 Database connection not closed');
  }
}

// Run main function if this file is executed directly
if (require.main === module) {
  mongoData()
    .then(() => {
      console.log('\n✨ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Script failed:', error);
      process.exit(1);
    });
}

// Export for use in other files
//module.exports = { mongoData };
module.exports = { mongoData, getUserByEmail };