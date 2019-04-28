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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});


app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // save to the mongodb
  // the collection will be the plural of upur model
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });
});

// put will compleetely replace the old one
// can also use patch to update an existing resource with new values
app.put("/api/posts/:id", (req, res, next) => {
  // need to make _id same as req.id since it is immutable
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post)
    .then(result => {
      console.log(result);
      res.status(200).json({message: "Update successful!"})
    });
});

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

app.delete("/api/posts/:id", (req, res, next) => {
  // console.log(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: 'Post deleted'});
  })
});



module.exports = app;
