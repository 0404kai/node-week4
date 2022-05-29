const express = require('express');
const router = express.Router();
const userController = require('../controller/users');
const { isAuth } = require('../statusHandle/auth');

router
  .get('/userList', userController.userList)
  .post('/sign_up', userController.sign_up)
  .post("/sign_in", userController.sign_in)
  .get('/profile', isAuth, userController.profile)
  .post("/updatePassword", isAuth, userController.updatePassword)
  .patch('/updateProfile', isAuth, userController.updateProfile)

module.exports = router;