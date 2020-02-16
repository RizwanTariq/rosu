const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");

const router = express.Router();

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 4, maxlength: 50 },
  phone: { type: String, required: true },
  isGold: { type: Boolean, default: false, minlength: 11, maxlength: 13 }
});
const Customer = mongoose.model("Customer", customerSchema);

//GET:all
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

//POST
router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });

  customer = await customer.save();
  res.send(customer);
});

//UPDATE
router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold == null ? false : req.body.isGold
    },
    { new: true }
  );
  if (!customer) return res.status(404).send("No customer found...");
  res.send(customer);
});

//DELETE
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(404).send("No customer found...");

  res.send(customer);
});

//GET:id
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("No customer found...");

  res.send(customer);
});

function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .min(4)
      .max(50)
      .required(),
    phone: Joi.string()
      // .pattern(new RegExp(/^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/))
      .required(),
    isGold: Joi.boolean()
  };
  return Joi.validate(customer, schema);
}

module.exports = router;
