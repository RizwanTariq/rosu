const Joi = require("joi");
const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

const router = express.Router();

//POST
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  res.send(true);
});

function validate(req) {
  const schema = {
    email: Joi.string()
      .email()
      .max(255)
      .required(),
    password: Joi.string().required()
  };
  return Joi.validate(req, schema);
}

module.exports = router;