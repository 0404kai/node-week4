const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/users');
const appError = require('../statusHandle/appError');
const handleErrorAsync = require('../statusHandle/handleErrorAsync');
const successHandle = require('../statusHandle/successHandle');
const { generateSendJWT, isAuth } = require('../statusHandle/auth');

const userController = {
  userList: handleErrorAsync(async(req, res, next) =>{
    const allUser = await User.find();
    res.status(200).json({
      status: 'success',
      user: allUser
    });
  }),
  
  sign_up: handleErrorAsync(async(req, res, next) =>{
    let {email, password, confirmPassword, name} = req.body;
    
    if(!email || !password || !confirmPassword || !name){
      return next(appError(400, "欄位不可為空！", next));
    }
    
    if(!validator.isLength(name, {min: 2})){
      return next(appError(400, "暱稱最少兩個字元", next));
    }
    
    if(!validator.isEmail(email)){
      return next(appError(400, "Email 格式有誤", next));
    }
    
    if(await User.findOne({ email })){
      return next(appError(400, "Email 已被註冊", next));
    }
    
    if(password !== confirmPassword){
      return next(appError(400, "密碼不一致！", next));
    }
    
    if(!validator.isLength(password, {min: 8})){
      return next(appError(400, "密碼不可低於 8 碼", next));
    }
    
    if(validator.isAlpha(password) || validator.isNumeric(password)){
      return next(appError(400, "密碼需英數混合", next));
    }
    
    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      email,
      password,
      name
    });
    
    generateSendJWT(newUser, 201, res, "註冊成功");
  }),

  sign_in: handleErrorAsync(async(req, res, next) =>{
    let {email, password} = req.body;
    if(!email || !password){
      return next(appError(400, "帳號密碼不可為空！", next));
    }
    const user = await User.findOne({ email }).select('+password')
    const auth = await bcrypt.compare(password, user.password);
    if(!auth){
      return next(appError(400, "密碼錯誤！", next));
    }
    
    generateSendJWT(user, 200, res, "登入成功");
  }),

  updatePassword: handleErrorAsync(async(req, res, next) =>{
    const { password, confirmPassword } = req.body;
    if(password !== confirmPassword){
      return next(appError(400, "密碼不一致！", next));
    }
    if(!validator.isLength(password, {min: 8})){
      return next(appError(400, "密碼不可低於 8 碼", next));
    }
    
    if(validator.isAlpha(password) || validator.isNumeric(password)){
      return next(appError(400, "密碼需英數混合", next));
    }
  
    newPassword = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword
    })
  
    generateSendJWT(user, 200, res, "密碼修改成功")
  }),

  profile: handleErrorAsync(async(req, res, next) =>{
    successHandle(res, req.user)
  }),

  updateProfile: handleErrorAsync(async(req, res, next) =>{
    let { name, gender, photo } = req.body;
    if(!name || !gender){
      return next(appError(400, "暱稱、性別不可為空！", next));
    }
    if(!validator.isLength(name, {min: 2})){
      return next(appError(400, "暱稱最少兩個字元", next));
    }
    const user = await User.findByIdAndUpdate(req.user.id, {
      name,
      gender,
      photo
    }, { runValidators: true })
    successHandle(res, user);
  })
};

module.exports = userController;