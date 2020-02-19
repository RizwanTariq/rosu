const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true
  },
  numberInStock: { type: Number, required: true, min: 0, max: 255 },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
  genre: {
    type: genreSchema,
    required: true
  }
});
const Movie = mongoose.model("Movie", movieSchema);

//Validation Function
function validateMovie(movie) {
  const schema = {
    title: Joi.string()
      .min(2)
      .max(50)
      .required(),
    numberInStock: Joi.number()
      .min(0)
      .max(255)
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(255)
      .required(),
    genreId: Joi.objectId().required()
  };
  return Joi.validate(movie, schema);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
