const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define the schema
const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no two users have the same email
        lowercase: true, // Converts email to lowercase
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum length for password
    },
   token: {
    type: String
   }
});

// Create the User model
const User = mongoose.model('User');

// Export the model
module.exports = User;
