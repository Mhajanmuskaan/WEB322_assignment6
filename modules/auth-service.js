const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Step 5

const Schema = mongoose.Schema; // Step 4

let User; // will be set in initialize()

// Step 6: Create the userSchema
const userSchema = new Schema({
  userName: {
    type: String,
    unique: true
  },
  password: String,
  email: String,
  loginHistory: [{
    dateTime: Date,
    userAgent: String
  }]
});

function initialize() {
    return new Promise(function (resolve, reject) {
      let db = mongoose.createConnection(process.env.MONGODB);
  
      db.on('error', (err) => {
        reject(err);
      });
  
      db.once('open', () => {
        User = db.model("users", userSchema);
        resolve();
      });
    });
  }

  function registerUser(userData) {
    return new Promise((resolve, reject) => {
      if (userData.password !== userData.password2) {
        reject("Passwords do not match");
        return;
      }
  
      // 🔐 Hash the password
      bcrypt.hash(userData.password, 10)
        .then((hash) => {
          // Now store the hashed password in DB
          let newUser = new User({
            userName: userData.userName,
            password: hash, // ✅ Use the hashed password
            email: userData.email,
            loginHistory: []
          });
  
          newUser.save()
            .then(() => resolve())
            .catch(err => {
              if (err.code === 11000) {
                reject("User Name already taken");
              } else {
                reject("There was an error creating the user: " + err);
              }
            });
        })
        .catch((err) => {
          reject("There was an error encrypting the password"); // ⚠️ If bcrypt fails
        });
    });
  }
  

  function checkUser(userData) {
    return new Promise((resolve, reject) => {
      User.find({ userName: userData.userName })
        .then(users => {
          if (users.length === 0) {
            reject("Unable to find user: " + userData.userName);
            return;
          }
  
          const user = users[0];
  
          // ✅ Use bcrypt to compare the entered password with the hashed one
          bcrypt.compare(userData.password, user.password)
            .then((result) => {
              if (!result) {
                reject("Incorrect Password for user: " + userData.userName);
                return;
              }
  
              // ✅ Update login history
              if (user.loginHistory.length === 8) {
                user.loginHistory.pop();
              }
  
              user.loginHistory.unshift({
                dateTime: (new Date()).toString(),
                userAgent: userData.userAgent
              });
  
              User.updateOne(
                { userName: user.userName },
                { $set: { loginHistory: user.loginHistory } }
              )
                .then(() => resolve(user))
                .catch(err => {
                  reject("There was an error verifying the user: " + err);
                });
            })
            .catch(err => {
              reject("Error comparing passwords: " + err);
            });
        })
        .catch(() => {
          reject("Unable to find user: " + userData.userName);
        });
    });
  }
  

  module.exports = {
    initialize,
    registerUser,
    checkUser
  };
  
  
  
  
