const sendMail = require("../mail/index.js");
const regModel = require("../models/regModel.js");
const utils = require("../helper/utils");
const { msgConstants } = require("../helper/msgConstants");
const mailBody = require("../html/email.body");

const registerController = async (req, res) => {
  let updateObject = Object.assign({});

  for (const i of ["email", "password", "name", "age"]) {
    if (!req.body[i])
      return res.json({ success: false, msg: `Please Enter ${i}` });
    else updateObject[i] = req.body[i];
  }

  const emailExist = await regModel.findOne({
    email: req.body.email.toLowerCase(),
  });

  if (!emailExist) {
    updateObject["password"] = utils.hashPassword(req.body["password"]);
    updateObject["profile"] = req.file?.path;

    const user = await regModel(updateObject).save();

    if (user) {
      sendMail(
        user.email,
        "Deft Social Account verification",
        mailBody.vfMail(dbResult._id, "Click to verify")
      );
      return res.json(utils.createSuccessResponse(msgConstants.userRegistered));
    } else
      return res
        .json(utils.createErrorResponse(msgConstants.userNotRegistered))
        .status(400);
  } else
    return res
      .json(utils.createErrorResponse(msgConstants.emailAlreadyExist))
      .status(400);
};

const verifyController = async (req, res) => {
  if (!req.params.id)
    return res.json({ success: false, msg: "Id not on params" }).status(400);
  regModel
    .updateOne({ _id: req.params.id }, { verified: true })
    .then(() => {
      return res
        .json(utils.createSuccessResponse(msgConstants.accountVerified))
        .status(200);
    })
    .catch((err) => {
      return res.json({ success: false, error: err.message });
    });
};

const loginController = async (req, res) => {
  for (const i of ["email", "password", "deviceId", "deviceModel"])
    if (!req.body[i]) return res.json({ success: false, msg: `Provide ${i}` });

  const user = await regModel.findOne({ email: req.body.email.toLowerCase() });

  if (user) {
    if (!utils.comparePassword(req.body.password, user.password))
      return res.json(utils.createErrorResponse(msgConstants.wrongPassword));

    if (!user.verified)
      return res.json(utils.createErrorResponse(msgConstants.verify));
    let token = utils.generateToken({
      _id: user._id,
      password: user.password,
      deviceId: user.deviceId,
    });

    const loginSession = await regModel.updateOne(
      { email: req.body.email },
      { deviceId: req.body.deviceId, deviceModel: req.body.deviceModel }
    );

    if (loginSession) return res.json({ success: true, token });
  } else return res.json(utils.createErrorResponse(msgConstants.userNotFound));
};

const getUserController = (req, res) => {
  let user = Object.assign({});

  for (let i of ["name", "email", "profile", "age"]) user[i] = req.user[i];
  return res.json(utils.createSuccessResponse("", user));
};

const changePassword = async (req, res) => {
  for (const i of ["oldPassword", "newPassword"])
    if (!req.body[i])
      return res.json(utils.createErrorResponse(msgConstants.pp + ` ${i}`));

  let user = req.user;

  if (utils.comparePassword(req.body.oldPassword, user.password)) {
    user["password"] = utils.hashPassword(req.body.newPassword);
    await user.save();

    return res.json(utils.createSuccessResponse(msgConstants.passwordChanged));
  } else
    return res.json(utils.createErrorResponse(msgConstants.wrongOldPassword));
};

const forgetPassword = async (req, res) => {
  if (!req.body.email)
    return res.json(utils.createErrorResponse(msgConstants.pp + "email"));

  const checkUser = await regModel.findOne({ email: req.body.email });

  if (checkUser) {
    const requested = await regModel.updateOne({
      email: req.body.email,
      $set: { passwordChangeRequest: true },
    });

    if (requested) {
      sendMail(
        req.body.email,
        "Change your password",
        mailBody.fgMail(
          utils.generateToken({ _id: checkUser._id }),
          "Click to change"
        )
      );
    }
    return res.json(utils.createSuccessResponse(msgConstants.forgetPassMsg));
  } else {
    return res.json(utils.createErrorResponse(msgConstants.wrongEmail));
  }
};

const resetPassword = async (req, res) => {
  if (!req.body.newpassword)
    return res.json(utils.createErrorResponse(msgConstants.provideNewPassword));

  if (req.user.passwordChangeRequest) {
    await regModel.updateOne(
      { _id: req.user._id },
      {
        password: utils.hashPassword(req.body.newpassword),
        passwordChangeRequest: false,
      }
    );
    return res.json(utils.createSuccessResponse(msgConstants.passwordChanged));
  } else {
    return res.json(utils.createErrorResponse(msgConstants.sessionExpired));
  }
};

const logout = async (req, res) => {
  let user = req.user;
  user["deviceId"] = null;
  user["deviceModel"] = null;
  await user.save();
  return res.json(utils.createSuccessResponse(msgConstants.logout));
};

const updateAccount = async (req, res) => {
  let user = req.user;

  for (let i of ["email", "name", "age"])
    if (req.body[i]) user[i] = req.body[i];
  user["profile"] = req.file ? req.file.path : user["profile"];

  if (req.body["email"] && req.body["email"].toLowerCase() != user["email"]) {
    let emailExist = await regModel.findOne({
      email: req.body["email"].toLowerCase(),
    });

    if (emailExist)
      return res.json(
        utils.createErrorResponse(msgConstants.emailAlreadyExist)
      );
  } else {
    return res.json("yop");
  }
};

module.exports = {
  registerController,
  verifyController,
  loginController,
  updateAccount,
  getUserController,
  changePassword,
  forgetPassword,
  resetPassword,
  logout,
};
