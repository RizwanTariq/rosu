const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 4, maxlength: 50 },
  phone: { type: String, required: true },
  isGold: { type: Boolean, default: false, minlength: 11, maxlength: 13 }
});
const Customer = mongoose.model("Customer", customerSchema);

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

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
