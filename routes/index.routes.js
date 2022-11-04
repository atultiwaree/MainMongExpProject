const express = require("express");
const routes = express.Router();
const user_routes = require("../routes/user.routes");
const post_routes = require("../routes/post.routes");

routes.use("/user", user_routes);
routes.use("/post", post_routes);

module.exports = routes;
