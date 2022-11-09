const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  commentByUserId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  comment: {
    type: String,
  },
});

const commentModel = mongoose.model("Comments", commentSchema);

module.exports = { commentModel };
