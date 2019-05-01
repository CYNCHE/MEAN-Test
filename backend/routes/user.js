const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const router = express.Router();


router.post("/signup", (req, res, next) => {

  // use hash to encrypt the password
  console.log(req.body.password);
  console.log(req.body.email);
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          //console.log("there");
          res.status(201).json({
            message: 'User created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    })
});


router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    // first check if the user exist in the database
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed. Please register first."
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    // check if the password is correct
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed. Incorrect password."
        });
      }

      // if password is correct, construct a JWT
      // which expires in one hour
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        'my-secret-hash-string',
        { expiresIn: '1h' }
      );

      res.status(200).json({
        token: token
      })

    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed."
      });
    });
});




module.exports = router;
