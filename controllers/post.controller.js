const { msgConstants } = require("../helper/msgConstants");
const utils = require("../helper/utils");

module.exports.createPost = async (req, res) => {
  return res.json(utils.createSuccessResponse(msgConstants.wrongPassword));
};
