const Post = require("../models/posts");
const success = require("../statusHandle/successHandle");
const handleErrorAsync = require("../statusHandle/handleErrorAsync");
const appError = require("../statusHandle/appError");
const contentHandle = require("../statusHandle/contentHandle");

const postController = {
  get: handleErrorAsync(async (req, res, next) => {
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const post = await Post.find(q)
      .populate({
        path: "user",
        select: "name photo",
      })
      .sort(timeSort);
    success(res, post);
  }),

  post: handleErrorAsync(async (req, res, next) => {
    const data = req.body;
    if (data.content) {
      const newPost = await Post.create(contentHandle(data));
      success(res, newPost);
    } else {
      next(appError(400, "請輸入正確內容！", next));
    }
  }),

  patch: handleErrorAsync(async (req, res, next) => {
    const data = req.body;
    const id = req.params.id;
    if (data.content) {
      const patchData = await Post.findByIdAndUpdate(id, contentHandle(data));
      if(patchData !== null){
        success(res, contentHandle(data));
      }else{
        next(appError(400, "找不到貼文！", next))
      }      
    } else {
      next(appError(400, "請輸入正確內容！", next));
    }
  }),

  deletes: handleErrorAsync(async (req, res, next) => {
    await Post.deleteMany({});
    success(res, "刪除全部成功！");
  }),
  
  delete: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const delRes = await Post.findByIdAndDelete(id);
    if (delRes !== null) {
      success(res, "刪除單筆成功！");
    } else {
      next(appError(400, "找不到貼文！", next));
    }
  }),
};

module.exports = postController;
