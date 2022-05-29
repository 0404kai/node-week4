const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '請輸入您的名字']
  },
  gender:{
    type: String,
    enum:["male", "female", "private"]
  },
  email: {
    type: String,
    required: [true, '請輸入您的 Email'],
    unique: true,
    lowercase: true,
    select: false
  },
  password:{
    type: String,
    required: [true,'請輸入密碼'],
    minlength: 8,
    select: false
  },
  photo: String,
},
{ 
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: false }
});

const User = mongoose.model('User', userSchema);
module.exports = User;