const express = require("express");
const Transaction = require("mongoose-transactions");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const { validate, Rental } = require("../models/rental");

const router = express.Router();
const transaction = new Transaction();

//Services
//GET
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");

  res.send(rentals);
});
//POST
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie || movie.numberInStock < 1)
    return res.status(400).send("Requested movie not available");

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Customer not available");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  try {
    const rentalId = transaction.insert("Rental", rental);
    transaction.update(
      "Movie",
      movie._id,
      { $inc: { numberInStock: -1 } },
      { new: true }
    );
    const result = await transaction.run();
    res.send(result[0]);
  } catch (error) {
    console.log(error);
    transaction.rollback();
  }
});

module.exports = router;
