const commentRouter = require("express").Router();
const Comment = require("../models/comment");

commentRouter.get("/", async (_request, response) => {
  const comments = await Comment.find({});
  response.json(comments);
});

commentRouter.post("/", async (request, response) => {
  const comment = new Comment({ ...request.body });
  const savedComment = await comment.save();
  response.status(201).json(savedComment);
});

module.exports = commentRouter;
