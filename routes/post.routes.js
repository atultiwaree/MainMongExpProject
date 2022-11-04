const express = require("express");
const { asyncTryCatchMiddleware } = require("../middleware/async");
const routes = express.Router();
const controller = require("../controllers/post.controller");

routes.post("/post", asyncTryCatchMiddleware(controller.createPost));

module.exports = routes;
