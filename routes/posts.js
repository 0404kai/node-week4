const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const User = require('../models/users');
const {success, error}  = require('../statusCode/statusHandle')

router
.get('/', async(req, res, next) =>  {
  const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt";
  const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
  const post = await Post.find(q).populate({
    path: 'user',
    select: 'name photo'
  }).sort(timeSort);;
  success(res, post);
})
.post('/', async(req, res, next) =>  {
  try{
      const data = req.body;
      if(data.content !== undefined){
          const newPost = await Post.create(
              {
                user: data.user,
                content: data.content,
                tags:data.tags,
                type:data.type
              }
          );
          success(res, newPost);
      }else{
        error(res);
      }
  }catch{
    error(res);
  }
})
.delete('/', async(req, res, next)=>{
  const post = await Post.deleteMany({});
  res.status(200).json({
      status: 'success',
      message: '刪除成功！'
  });
})
.delete('/:id', async(req, res, next)=>{
  try{
    const id = req.params.id;
    await Post.findByIdAndDelete(id);
    res.status(200).json({
        status: 'success',
        message: '刪除單筆成功！'
    });
  }catch{
    error(res);
  }
})
.patch('/:id', async(req, res, next)=>{
  try{
      const data = req.body;
      const id = req.params.id;
      if(data.content !== undefined){
          const editContent = {
            user: data.user,
            content: data.content,
            tags:data.tags,
            type:data.type
          };
          const editPost = await Post.findByIdAndUpdate(id,editContent);
          success(res, editPost);
      }else{
          error(res);
      }
  }catch{
    error(res);
  }
});

module.exports = router;