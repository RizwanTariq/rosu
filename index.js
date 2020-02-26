const winston = require("winston");
const express = require("express");
require("express-async-errors");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validate")();

//SettingUp port
const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}`));
