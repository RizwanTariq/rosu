const Joi = require("joi");
const express = require("express");
const app = express();

//MiddleWares
app.use(express.json());

const genres = [
  { id: 1, name: "Comedy" },
  { id: 2, name: "Action" },
  { id: 3, name: "Horror" }
];

//Services
//GET
app.get("/api/genres/", (req, res) => {
  res.send(genres);
});
app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("No genre found...");
  res.send(genre);
});

//POST
app.post("/api/genres/", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = { id: genres.length + 1, name: req.body.name };

  genres.push(genre);
  res.send(genre);
});

//UPDATE || PUT
app.put("/api/genres/:id", (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("No genre found...");

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genres);
});

//Validation Function
function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(genre, schema);
}

//SettingUp port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
