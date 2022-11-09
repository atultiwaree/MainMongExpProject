const { msgConstants } = require("../helper/msgConstants");
const utils = require("../helper/utils");
const { postsModel } = require("../models/post.model");
const { commentModel } = require("../models/comment.model");

module.exports.createPost = async (req, res) => {
  let object = Object.assign({});

  for (const i of ["postTitle", "postDescription"]) {
    if (!req.body["postTitle"]) return res.json(utils.createErrorResponse(msgConstants.titleRequired));
    else object[i] = req.body[i];
  }

  object["userId"] = req.user._id;

  if (req.files.length > 0) {
    if (req.files.length > 5) return res.json(utils.createErrorResponse(msgConstants.numberOfPostImage));
    else object["postImages"] = req.files.map((i) => i.path);
  }

  postsModel(object).save();
  return res.json(utils.createSuccessResponse(msgConstants.postCreated));
};

module.exports.deletePost = async (req, res) => {
  if (!req.body.postId) return res.json(utils.createErrorResponse(msgConstants.postIdIsRequired));

  const isPostPresent = await postsModel.findOne({
    userId: req.user._id,
    postId: req.body.postId,
  });

  if (isPostPresent) {
    await isPostPresent.remove();
    return res.json(utils.createSuccessResponse(msgConstants.deletedPostSuccessfully));
  } else return res.json(utils.createErrorResponse(msgConstants.postIsNotPresent));
};

module.exports.postList = async (req, res) => {
  const userId = req.body.userId ?? req.user._id;
  console.log(userId);
  const postsLists = await postsModel.find({ userId }, { postTitle: 1, _id: 1 });
  return res.json(
    utils.createSuccessResponse(
      userId === req.user._id ? msgConstants.showingYourAllPosts : msgConstants.showingOtherUserAllPost,
      postsLists
    )
  );
};

module.exports.postDetails = async (req, res) => {
  if (!req.body.postId) return res.json(utils.createErrorResponse(msgConstants.postIdIsRequired));
  const postDetails = await postsModel.find({ _id: req.body.postId });
  return res.json(utils.createSuccessResponse(msgConstants.postDescription, postDetails));
};

module.exports.updatePost = async (req, res) => {
  if (!req.body.postId) return res.json(utils.createErrorResponse(msgConstants.providePostId));
  const currentPostOfThisUser = await postsModel.findOne({
    $and: [{ userId: req.user._id }, { _id: req.body.postId }],
  });

  if (currentPostOfThisUser) {
    for (const i of ["postTitle", "postDescription"]) if (req.body[i]) currentPostOfThisUser[i] = req.body[i];

    if (req.files.length > 0) {
      if (currentPostOfThisUser["postImages"].length + req.files.length - 1 >= 5)
        return res.json(utils.createErrorResponse(msgConstants.limitExceed));
      if (req.files.length > 1) currentPostOfThisUser["postImages"].push(...req.files.map((x) => x.path));
      else if (req.body.fo) currentPostOfThisUser["postImages"].splice(Number(req.body.fo), 1, req.files[0].path);
    } else if (req.body.fo) currentPostOfThisUser["postImages"].splice(Number(req.body.fo), 1);

    await currentPostOfThisUser.save();
    return res.json(utils.createSuccessResponse(msgConstants.successfullyUpdatedPost, currentPostOfThisUser));
  } else return res.json(utils.createErrorResponse(msgConstants.noPostFound));
};

module.exports.postComment = async (req, res) => {
  const commentData = Object.assign({});

  for (const i of ["postId", "comment"]) {
    if (!req.body[i]) return res.json(utils.createErrorResponse(`${i} is required field`));
    else commentData[i] = req.body[i];
  }

  commentData["commentByUserId"] = req.user._id;

  const data = await commentModel(commentData).save();

  return res.json({ data });
};
