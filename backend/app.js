const express = require('express');
const bodyParser = require("body-parser");
// require mongoose
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");

const app = express();

// connect mongoose to mongodb and checks if the
// connection is successful
mongoose.connect('mongodb://localhost/myapp', {useNewUrlParser: true})
  .then(
    () => { console.log("connection succeeded")},
    err => { console.log("connection failed")}
  );

app.use(bodyParser.json());

// allow visitors to access image folder
// use path to redirect
const path = require('path');
app.use("/images", express.static(path.join("backend/images")));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});


// make express aware of our routes
// that start with "/api/posts"
app.use("/api/posts", postsRoutes);

module.exports = app;
