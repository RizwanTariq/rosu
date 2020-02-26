const config = require("config");
module.exports = function() {
  //Validate jwtPrivateKey Environment Variable
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined..");
  }
};
