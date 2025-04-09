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
  
      let newUser = new User({
        userName: userData.userName,
        password: userData.password,
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
  
          if (users[0].password !== userData.password) {
            reject("Incorrect Password for user: " + userData.userName);
            return;
          }
  
          // loginHistory tracking
          if (users[0].loginHistory.length === 8) {
            users[0].loginHistory.pop();
          }
  
          users[0].loginHistory.unshift({
            dateTime: (new Date()).toString(),
            userAgent: userData.userAgent
          });
  
          User.updateOne(
            { userName: users[0].userName },
            { $set: { loginHistory: users[0].loginHistory } }
          ).then(() => {
            resolve(users[0]);
          }).catch(err => {
            reject("There was an error verifying the user: " + err);
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
  
  
  
  
