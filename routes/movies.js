const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");

const router = express.Router();

//Services
//GET
router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});
//POST
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre..");

  let movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: genre._id,
      name: genre.name
    }
  });

  movie = await movie.save();
  res.send(movie);
});
//GET:SINGLE BY :id
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("No movie found...");

  res.send(movie);
});
//UPDATE || PUT
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre..");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      genre: {
        _id: genre._id,
        name: genre.name
      }
    },
    { new: true }
  );
  if (!movie) return res.status(404).send("No movie found...");
  res.send(movie);
});
//DELETE
router.delete("/:id", [auth, admin], async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) return res.status(404).send("No movie found...");
  res.send(movie);
});

module.exports = router;
