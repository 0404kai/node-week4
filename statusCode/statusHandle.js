const express = require('express');
const Post = require('../models/posts');

const success = (res, post) =>{
  res.status(200).json({
    status: 'success',
    data: {
        post
    }
  });
}

const error = (res) =>{
  res.status(400).json({
    status: 'false',
    message: '欄位有誤或無此 ID'
  });
}

module.exports = {success, error}