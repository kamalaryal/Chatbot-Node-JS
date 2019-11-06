const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  facebook: {
    id: {
      type: String
    },
    name: {
      firstName: String,
      middleName: String,
      lastName: String
    },
    email: {
      type: String,
      lowercase: true
    }
  }
});

const User = mongoose.model('user', userSchema);
module.exports = User;