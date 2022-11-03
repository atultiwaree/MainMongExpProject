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

const regModel = mongoose.model("Registration", regSchema);
module.exports = regModel;
