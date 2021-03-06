const express = require("express");
const multer = require("multer");

const checkAuth = require('../middleware/check-auth');
const Post = require("../models/post");
const router = express.Router();


const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};


// config for multer, path to store image files
// and name standard
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // document path here is relative to server.js
    // cb(null, "backend/images");
    // check for the validity in the backend
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Incorrect mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  // normalize filename here
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    // add file extension
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});



// handles the post request
// add one new post
// single mean we are delaing with one single file in the image property of request body
router.post("", checkAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
  // get the server url
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    // construct path to the image
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });

  // save to the mongodb
  // the collection will be the plural of upur model
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        id: createdPost._id,
        // title: createdPost.title,
        // content: createdPost.content,
        // imagePath: createdPost.imagePath
        // spread operator to copy all the same name field
        ...createdPost
      }
    });
  });
});


// put will compleetely replace the old one
// can also use patch to update an existing resource with new values
router.put("/:id", checkAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  // need to make _id same as req.id since it is immutable
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  // automatically update post if id AND creator matches
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
    .then(result => {
      if (result.nModified > 0) {
        res.status(200).json({message: "Update successful!"});
      } else {
        res.status(401).json({ message: "You are not authorized to update the post!"});
      }
    });
});


// handles get request for all the posts
router.get('', (req, res, next) => {
  // the query paramter name is chosen by us
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();

  // temp variable to remember the documents
  let fetchedPosts;

  // if we do have query paramters
  // otherwise simply returns all
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then(count => {
      // add in the callback so it won't be called before data fetched successfully
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
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

router.delete("/:id", checkAuth, (req, res, next) => {
  // console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    console.log(result);
    console.log(result.nModified);
    if (result.n > 0) {
      res.status(200).json({ message: 'Post deleted' });
    } else {
      res.status(401).json({ message: 'You are not authorized to delete the post.' });
    }
  })
});

module.exports = router;
