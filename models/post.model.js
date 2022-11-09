const mongoose = require("mongoose");

const postsSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  postTitle: {
    type: String,
  },
  postDescription: {
    type: String,
    default: null,
  },
  postImages: {
    type: Array,
    default: [],
  },
});

const postsModel = mongoose.model("Posts", postsSchema);
module.exports = { postsModel };
