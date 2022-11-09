const utils = require("../helper/utils");
const { msgConstants } = require("../helper/msgConstants");
const { followersModel } = require("../models/followers.model");

module.exports.follow = async (req, res) => {
  const object = Object.assign({});
  if (!req.body.personId) return res.json(utils.createErrorResponse(msgConstants.followingPersonIdRequired));

  const alreadyFollowed = await followersModel.findOne({
    $and: [{ userId: req.user._id }, { followsId: req.body.personId }],
  });

  if (alreadyFollowed) return res.json(utils.createErrorResponse(msgConstants.alreadyFollowed));

  object["userId"] = req.user._id;
  object["followsId"] = req.body.personId;

  await followersModel(object).save();

  return res.json(utils.createSuccessResponse(msgConstants.followRequestSent));
};

module.exports.unfollow = async (req, res) => {
  if (!req.body.personId) return res.json(utils.createErrorResponse(msgConstants.unFollowPersonIdRequired));

  const followProof = await followersModel.findOne({
    $and: [{ userId: req.user._id }, { followsId: req.body.personId }],
  });

  if (followProof) {
    const x = await followProof.remove();
    return res.json(utils.createSuccessResponse(utils.createSuccessResponse(msgConstants.unFollowedUser)));
  } else return res.json(utils.createErrorResponse(utils.createErrorResponse(msgConstants.badRequest)));
};

module.exports.requestAction = async (req, res) => {
  const followersList = await followersModel.find({ userId: req.user._id });

  if (req.body.approvalId) {
    const thisUser = await followersModel.findOne({ followsId: req.body.approvalId });

    if (req.body.accept) {
      thisUser["isApproved"] = true;
      await thisUser.save();
      return res.json(utils.createSuccessResponse(msgConstants.followRequestAccepted));
    } else {
      thisUser["isApproved"] = false;
      await thisUser.save();
      return res.json(utils.createSuccessResponse(msgConstants.followRequestRejected));
    }
  }

  return res.json(
    utils.createSuccessResponse(
      "Your followers list",
      followersList.map((x) => x.followsId)
    )
  );
};
