const _ = require("lodash");
const express = require("express");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");

const router = express.Router();

//POST
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //validate Password
  if (!req.body.password) return res.status(400).send("Password is required..");

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered..");
  //

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  //Hashing Password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.genrateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
