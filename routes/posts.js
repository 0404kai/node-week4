const express = require("express");
const router = express.Router();
const postsController = require('../controller/posts');
const { isAuth } = require('../statusHandle/auth');

router
  .get("/posts", isAuth, postsController.get)
  .post("/post", isAuth, postsController.post)
  .patch("/post/:id", postsController.patch)
  .delete("/posts", postsController.deletes)
  .delete("/post/:id", postsController.delete);

module.exports = router;