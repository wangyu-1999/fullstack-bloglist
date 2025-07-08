const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const blogRouter = require("./controllers/blog");
const userRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");
const commentRouter = require("./controllers/comment");
const { info, error } = require("./utils/logger");
const {
  unknownEndpoint,
  errorHandler,
  userExtractor,
} = require("./utils/middleware");
const mongoose = require("mongoose");
const { MONGO_URI, NODE_ENV } = require("./utils/config");
mongoose.set("strictQuery", false);

try {
  mongoose.connect(MONGO_URI);
  info("connected to MongoDB");
} catch (e) {
  error(`error connecting to MongoDB: ${e.message}`);
}

app.use(cors());
app.use(express.json());
app.use("/api/blogs", userExtractor, blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/comments", commentRouter);
if (NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}
app.use(unknownEndpoint);
app.use(errorHandler);
module.exports = app;
