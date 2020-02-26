const mongoose = require("mongoose");
const config = require("config");
const winston = require("winston");

module.exports = function() {
  //MongoDb Connection
  mongoose
    .connect(config.get("conString"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    .then(() => winston.info("mongodb connected..."));
};
