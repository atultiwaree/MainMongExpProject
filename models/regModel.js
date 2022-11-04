const mongoose = require("mongoose");

const regSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  profile: {
    type: String,
    require: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  passwordChangeRequest: {
    type: Boolean,
    default: false,
  },
  deviceId: {
    type: String,
    default: null,
  },
  deviceModel: {
    type: String,
    default: null,
  },
});

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
    default: null,
  },
});

const regModel = mongoose.model("Registration", regSchema);
const postsModel = mongoose.model("Posts", postsSchema);

module.exports = { regModel, postsModel };
