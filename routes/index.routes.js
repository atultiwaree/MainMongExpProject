const express = require("express");
const routes = express.Router();
const user_routes = require("../routes/user.routes");
const post_routes = require("../routes/post.routes");
const followers_routes = require("../routes/followers.routes");

routes.use("/user", user_routes);
routes.use("/post", post_routes);
routes.use("/followers", followers_routes);

module.exports = routes;
