const express = require("express");
const { asyncTryCatchMiddleware } = require("../middleware/async");
const utils = require("../helper/utils");
const routes = express.Router();
const controller = require("../controllers/post.controller");
const upload = require("../helper/multer");
const { verifyToken } = require("../middleware/jwtVerMid");
routes.post("/createpost", verifyToken, upload.array("postImages"), asyncTryCatchMiddleware(controller.createPost));
routes.delete("/deletepost", verifyToken, asyncTryCatchMiddleware(controller.deletePost));
routes.post("/postList", verifyToken, asyncTryCatchMiddleware(controller.postList));
routes.post("/postdetails", verifyToken, asyncTryCatchMiddleware(controller.postDetails));
routes.put("/updatepost", verifyToken, upload.array("postImages"), asyncTryCatchMiddleware(controller.updatePost));
routes.post("/postcomment", verifyToken, asyncTryCatchMiddleware(controller.postComment));

module.exports = routes;
