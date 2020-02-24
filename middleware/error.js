const winston = require("winston");

module.exports = function(err, req, res, next) {
  //LoG the Exception
  winston.error(err.message, err);
  //error
  //warn
  //info
  //verbose
  //debug
  //silly

  //ERROR
  res.status(500).send("Something goes wrong on server");
};
