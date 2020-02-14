const mongoose = require("mongoose");
const config = require("config");
const express = require("express");
const genres = require("./routes/genres");

const app = express();
mongoose
  .connect(config.get("conString"), {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("mongodb connected..."))
  .catch(err => console.error("mongodb not connected..", err));

//MiddleWares
app.use(express.json());
app.use("/api/genres", genres);

//SettingUp port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
