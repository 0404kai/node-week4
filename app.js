const path = require('path');
const cors = require('cors');
const express = require('express');
const error = require('http-errors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AppError = require('./statusHandle/appError')
const {resErrorDev, resErrorProd} = require('./statusHandle/resError');

// 處理程式內部錯誤
process.on('uncaughtException', err => {
	console.error('Uncaughted Exception！')
  // 記錄錯誤，等其他服務處理完成就停掉該 process
	console.error(err);
	process.exit(1);
});

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('資料庫連接成功'))
  .catch(err =>{
    console.log('資料庫連接失敗', err)
  });

var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

app.use((req, res, next) =>{
  res.status(404).json({
    status: 'error',
    message: error(404, '找不到網站！'),
  })
});

app.use((err, req, res, next) =>{
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'dev') {
    resErrorDev(err, res);
  }else if (process.env.NODE_ENV === 'prod') {
    if(err.isAxiosError == true){
      err.message = "axios 連線錯誤";
      err.isOperational = true;
      return resErrorProd(err, res);
    }else if (err.name === 'ValidationError'){
      // mongoose 資料辨識錯誤
      err.isOperational = true;
      return resErrorProd(err, res);
    }
    resErrorProd(err, res);
}});

// 未捕捉到的 catch
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
  // 記錄於 log 上
});

module.exports = app;