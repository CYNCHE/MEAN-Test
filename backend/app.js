const express = require('express');
const bodyParser = require("body-parser");
// require mongoose
const mongoose = require("mongoose");

const Post = require("./models/post");

const app = express();

// connect mongoose to mongodb and checks if the
// connection is successful
mongoose.connect('mongodb://localhost/myapp', {useNewUrlParser: true})
  .then(
    () => { console.log("connection succeeded")},
    err => { console.log("connection failed")}
  );

app.use(bodyParser.json());


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});


app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // save to the mongodb
  // the collection will be the plural of upur model
  post.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
})

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(documents => {
      // add in the callback so it won't be called before data fetched successfully
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: documents
      });
    });

});

module.exports = app;
