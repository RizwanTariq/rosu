module.exports = function(err, req, res, next) {
  //LoG the Exception
  res.status(500).send("Something goes wrong on server");
};
