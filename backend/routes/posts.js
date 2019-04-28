const express = require("express");

const Post = require("../models/post");
const router = express.Router();

// handles the post request
// add one new post
router.post("", (req, res, next) => {
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
router.put("/:id", (req, res, next) => {
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

// handles get request for all the posts
router.get('', (req, res, next) => {
  Post.find()
    .then(documents => {
      // add in the callback so it won't be called before data fetched successfully
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: documents
      });
    });

});

// handles get request for single post given the post id
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found'});
    }
  })
})

router.delete("/:id", (req, res, next) => {
  // console.log(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: 'Post deleted'});
  })
});

module.exports = router;
