const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const regModel = require("../models/regModel.js");

module.exports.verifyToken = (token) => {
  try {
    return JWT.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    return false;
  }
};

module.exports.generateToken = (data) => JWT.sign(data, process.env.SECRET_KEY);

module.exports.createErrorResponse = (
  message,
  data = null,
  success = false
) => {
  return { success, message, data };
};

module.exports.createSuccessResponse = (message, data, success = true) => {
  return { success, message, data };
};

module.exports.hashPassword = (pass) =>
  bcrypt.hashSync(pass, Number(process.env.SALT_ROUND));

module.exports.comparePassword = (pass, hash) => bcrypt.compareSync(pass, hash);
