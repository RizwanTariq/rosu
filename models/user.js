const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const PasswordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: Boolean
});

userSchema.methods.genrateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const passwordComplexity = new PasswordComplexity({
    min: 8,
    max: 25,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4
  });
  const schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    email: Joi.string()
      .email()
      .max(255)
      .required(),
    password: passwordComplexity
  };
  return Joi.validate(user, schema);
}

module.exports.validate = validateUser;
module.exports.User = User;
