const mongoose = require('mongoose');

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
const UsersSchema = new Schema({
  // `username` is required and of type String, will store the user's username
  username: {
    type: String,
    required: true,
    unique: true
  },
  // 'password' is required and of type String, will store hashed and salted password
  password: {
    type: String,
    required: true
  }
});

// This creates our model from the above schema, using mongoose's model method
const Users = mongoose.model('Users', UsersSchema);

// Export the Articles model
module.exports = Users;