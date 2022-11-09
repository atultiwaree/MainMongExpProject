const express = require("express");
const routes = express.Router();
const controller = require("../controllers/followers.controller");
const { verifyToken } = require("../middleware/jwtVerMid");

routes.use("/follow", verifyToken, controller.follow);
routes.use("/requestaction", verifyToken, controller.requestAction);
routes.use("/unfollow", verifyToken, controller.unfollow);

module.exports = routes;
