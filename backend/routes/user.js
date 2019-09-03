const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  User.findOne({ email: req.body.email }).then(fetchedUser => {
    if(!fetchedUser) {
      bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user
          .save()
          .then(result => {
            res.status(201).json({
              message: 'new user created!',
              result: result
            });
          })
          .catch(err => {
            res.status(500).json({
              message: 'Invalid authentication credentials!'
            });
          });
      });
    } else {
      res.status(400).json({
        message: 'email already registered'
      });
    }
  });
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email}).then(user => {
    if (!user) {
      return res.status(401).json({
        message: 'User not found'
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if (!result) {
      return res.status(400).json({
        message: 'Invalid password'
      });
    }
    const token = jwt.sign(
      { email: fetchedUser.email, id: fetchedUser._id },
      'secret_this_should_be_longer',
      { expiresIn: '1hr' }
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });
  }).catch(error => {
    return res.status(400).json({
      message: 'Invalid request'
    });
  });
});

module.exports = router;
