const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // hide password by default in queries
    },

    avatar: {
      type: String,
      default: 'https://i.pravatar.cc/150?u=default',
    },

    bio: {
      type: String,
      default: '',
      maxlength: 300,
    },

    github: {
      type: String,
      default: '',
    },

    // Optional: for future expansion
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    // Optional: if you plan to handle password reset / email verification
    resetToken: String,
    resetTokenExpiry: Date,
  },
  {
    timestamps: true,
  }
);

// Hide sensitive info when converting to JSON
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    delete ret.resetToken;
    delete ret.resetTokenExpiry;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
