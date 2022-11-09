const mongoose = require("mongoose");
const followersSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  followsId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  isApproved: {
    type: Boolean,
    default: false,
  },
});

const followersModel = mongoose.model("Followers", followersSchema);

module.exports = { followersModel };
