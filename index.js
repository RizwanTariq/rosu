const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const config = require("config");
const express = require("express");
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const customers = require("./routes/customers");
const rentals = require("./routes/rentals");

const app = express();
mongoose
  .connect(config.get("conString"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("mongodb connected..."))
  .catch(err => console.error("mongodb not connected..", err));

//MiddleWares
app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);

//SettingUp port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
