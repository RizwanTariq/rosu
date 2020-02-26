const config = require("config");
const winston = require("winston");
require("winston-mongodb");
//Handling uncaught exceptions & Promise Rejections
module.exports = function() {
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );
  process.on("unhandledRejection", ex => {
    throw ex;
  });

  //Load winston TRANSPORTS
  {
    const { transports, format } = winston;
    winston.add(new transports.File({ filename: "logfile.log" }));
    winston.add(
      new transports.MongoDB({
        level: "error",
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
};
