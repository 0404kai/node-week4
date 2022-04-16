const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/users");
const success = require("../statusHandle/successHandle");
const handleErrorAsync = require("../statusHandle/handleErrorAsync");
const AppError = require("../statusHandle/appError");
const contentHandle = require('../statusHandle/contentHandle');

router
  .get("/", handleErrorAsync(async (req, res, next) => {
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
    const q = req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const post = await Post.find(q).populate({
        path: "user",
        select: "name photo",
      }).sort(timeSort);
    success(res, post);
  }))
  .post("/", handleErrorAsync(async (req, res, next) => {
      const data = req.body;
      if (data.content) {
        const newPost = await Post.create(contentHandle(data));
        success(res, newPost);
      } else {
          next(AppError(400, '請輸入正確內容！', next));
      }
    })
  )
  .delete("/", handleErrorAsync(async (req, res, next) => {
    await Post.deleteMany({});
    success(res, '刪除成功！')
  }))
  .delete("/:id", handleErrorAsync(async (req, res, next) => {
      const id = req.params.id;
      const delRes = await Post.findByIdAndDelete(id);
      if (delRes !== null) {
        success(res, '刪除單筆成功！')
      } else {
          next(AppError(500, '查無資料', next));
      }
    })
  )
  .patch("/:id", handleErrorAsync(async (req, res, next) => {
      const data = req.body;
      const id = req.params.id;
      if (data.content) {
        await Post.findByIdAndUpdate(id, contentHandle(data));
        success(res, contentHandle(data));
      } else {
          next(AppError(500, '請輸入正確內容！', next));
      }
    })
  );

module.exports = router;