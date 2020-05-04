const express = require("express");
const mongoose = require("mongoose");

const path = require("path");
const config = require("config");
const app = express();

//body parse middleware
app.use(express.json());

//db confi
const db = config.get("mongoURI");

//connect to mongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("The Mongo Got CONNECTED!!!!");
  })
  .catch(err => console.log(err));

//use routes
app.use("/api/purchases", require("./routes/api/purchases"));
app.use("/api/items", require("./routes/api/items"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

///serve static assets if in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server started on port ${port} - You Lucky Devil!`)
);
