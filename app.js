const path = require('path');
const cors = require('cors');
const express = require('express');
const error = require('http-errors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
  );
  
mongoose
.connect(DB)
.then(() => console.log('資料庫連接成功'));

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
    status: 'false',
    message: error(404, '找不到網站！')
  })
  next();
});

app.use((err, req, res, next) =>{
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message
  });
});

module.exports = app;