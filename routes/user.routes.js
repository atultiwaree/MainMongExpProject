const express = require("express");
const { asyncTryCatchMiddleware } = require("../middleware/async");

// Import controller

const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/jwtVerMid");
const routes = express.Router();

// Import middlewares

const upload = require("../helper/multer");

routes.post(
  "/register",
  upload.single("profile"),
  asyncTryCatchMiddleware(userController.registerController)
);
routes.get(
  "/verify/:id",
  asyncTryCatchMiddleware(userController.verifyController)
);
routes.post("/login", asyncTryCatchMiddleware(userController.loginController));
routes.get(
  "/getuser",
  verifyToken,
  asyncTryCatchMiddleware(userController.getUserController)
);
routes.post(
  "/changepassword",
  verifyToken,
  asyncTryCatchMiddleware(userController.changePassword)
);
routes.post(
  "/forgetpassword",
  asyncTryCatchMiddleware(userController.forgetPassword)
);
routes.put(
  "/resetpassword",
  verifyToken,
  asyncTryCatchMiddleware(userController.resetPassword)
);
routes.get(
  "/logout",
  verifyToken,
  asyncTryCatchMiddleware(userController.logout)
);
routes.put(
  "/updateaccount",
  verifyToken,
  upload.single("profile"),
  asyncTryCatchMiddleware(userController.updateAccount)
);
routes.delete(
  "/deleteaccount",
  verifyToken,
  asyncTryCatchMiddleware(userController.deleteAccount)
);

module.exports = routes;
