const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    useremail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    usermobile: {
      type: Number,
      required: true,
    },

    userpassword: {
      type: String,
      required: true,
    },

    resetOtp: {
      type: String,
      default: null,
    },

    resetOtpExpiresAt: {
      type: Date,
      default: null,
    },

    resetPasswordVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    userrole: {
      type: String,
      default: 'user',
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;