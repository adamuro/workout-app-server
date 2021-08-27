const mongoose = require("mongoose");
const { Schema } = mongoose;

const options = { timestapms: false };

const userSchema = new Schema({
  username: String,
  password: String,
}, options);

const User = mongoose.model("User", userSchema);

module.exports = User;
