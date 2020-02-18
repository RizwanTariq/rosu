const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 4, maxlength: 50 },
  phone: { type: String, required: true, minlength: 11, maxlength: 13 },
  isGold: { type: Boolean, default: false }
});
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 2, maxlength: 50 },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 255 }
});

const rentalSchema = new mongoose.Schema({
  customer: {
    type: customerSchema,
    required: true
  },
  movie: {
    type: movieSchema,
    required: true
  },
  dateOut: { type: Date, default: Date.now, required: true },
  dateReturned: Date,
  rentalFee: {
    type: Number,
    min: 0
  }
});

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
  const schema = {
    customerId: Joi.string().required(),
    movieId: Joi.string().required()
  };
  return Joi.validate(rental, schema);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;
