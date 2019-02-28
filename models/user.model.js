const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  status: { type: String, default: "active" },
  tokens: [
    {
      access: { type: String, required: true },
      token: { type: String, required: true }
    }
  ]
});

userSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = "auth";
  var token = jwt.sign({ _id: user._id.toHexString() }, "abc123").toString();

  user.tokens.push({ access, token });

  return user.save().then(() => {
    return token;
  });
};

userSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, "abc123");
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

module.exports = mongoose.model("User", userSchema);
