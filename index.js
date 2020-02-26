const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const winston = require("winston");
require("winston-mongodb");
const mongoose = require("mongoose");
const config = require("config");
const express = require("express");
require("express-async-errors");
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const customers = require("./routes/customers");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const error = require("./middleware/error");

const app = express();

//Load winston TRANSPORTS
{
  const { transports, format } = winston;
  winston.add(new transports.File({ filename: "logfile.log" }));
  winston.add(
    new transports.MongoDB({
      db: config.get("conString"),
      options: { useUnifiedTopology: true }
    })
  );
  winston.add(
    new transports.Console({
      format: format.combine(format.timestamp(), format.json())
    })
  );
}

//Validate jwtPrivateKey Environment Variable
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined..");
  process.exit(1);
}

//MongoDb Connection
mongoose
  .connect(config.get("conString"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log("mongodb connected..."))
  .catch(err => console.error("mongodb not connected..", err));

//MiddleWares
app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

//ERROR HANDLER MIDDLEWARE
app.use(error);

//SettingUp port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
