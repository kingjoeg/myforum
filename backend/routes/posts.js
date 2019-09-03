const express = require('express');
const router = express.Router();

// Post Model //
const Post = require('../models/post');

// Check Authorization Middleware //
const checkAuth = require('../middleware/check-auth');

// MULTER for handling files on the server //
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid MIME type!');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});


router.get('', (req, res, next) => {
  // Get Posts
  const pageSize = +req.query.pagesize;
  const pageIndex = +req.query.pageindex;
  let fetchedPosts;
  Post.find()
    .skip(pageSize * (pageIndex - 1))
    .limit(pageSize)
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: fetchedPosts,
        maxPosts: count
       });
    })
    .catch(error => {
      res.status(400).json({ message: 'Posts not found' });
    });
});

router.get('/:id', (req, res, next) => {
  // get single post form database using id
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(400).json({ message: 'no post found' });
    }
  }).catch(error => {
    res.status(400).json({
      message: 'fetching post failed'
    })
  });
});

router.post(
  '',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
  // Save Posts
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
  });
  post.save().then(() => {
    res.status(201).json({ message: 'New post added' });
  }).catch(() => {
    res.status(400).json({ message: 'Post failed' });
  });
});

router.put(
  '',
  checkAuth,
  multer({ storage: storage }).single('image')
  (req, res, next) => {

  });

module.exports = router;
