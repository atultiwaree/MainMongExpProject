const { msgConstants } = require("../helper/msgConstants");
const utils = require("../helper/utils");
const { postsModel } = require("../models/regModel");

module.exports.createPost = async (req, res) => {

  let object = Object.assign({})

  for (const i of ["postTitle", "postDescription"]) {

    if (!req.body["postTitle"]) return res.json(utils.createErrorResponse(msgConstants.titleRequired));
    else object[i] = req.body[i]
  }

  object['userId'] = req.user._id

  if (req.files.length > 0) {

    if (req.files.length > 5) return res.json(utils.createErrorResponse(msgConstants.numberOfPostImage));
    else object['postImages'] = req.files.map(i => i.path)

  }

  postsModel(object).save();
  return res.json(utils.createSuccessResponse(msgConstants.postCreated));
};

module.exports.deletePost = async (req, res) => {
  if (!req.body.postId) return res.json(utils.createErrorResponse(msgConstants.postIdIsRequired));

  const isPostPresent = await postsModel.findOne({ userId: req.user._id, postId: req.body.postId });

  if (isPostPresent) {
    await isPostPresent.remove();
    return res.json(utils.createSuccessResponse(msgConstants.deletedPostSuccessfully));
  } else return res.json(utils.createErrorResponse(msgConstants.postIsNotPresent));
};

module.exports.postList = async (req, res) => {

  let userId = req.body.userId ?? req.user._id
  let posts = await postsModel.find({ userId });

  return res.json(utils.createSuccessResponse(msgConstants.showOthersSinglePost, posts));
};

module.exports.postDetails = async (req, res) => {

  if (!req.body.postId) return res.json(utils.createErrorResponse(msgConstants.postIdIsRequired));

  let post = await postsModel.findOne({ _id: req.body.postId });

  return res.json(utils.createSuccessResponse(msgConstants.showOthersSinglePost, post));
};