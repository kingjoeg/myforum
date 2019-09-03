const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

// Connect to MongoDB database using mongoose //
mongoose.connect('mongodb+srv://Joe:IVmTyilhUGhkLQnp@cluster0-n35v7.mongodb.net/myforum?retryWrites=true')
  .then(() => {
    console.log('Connected to the Database!');
  })
  .catch(() => {
    console.log('Connection Failed!');
  });

// Attach Post Data to the Request //
app.use(bodyParser.json());

// Use Static files //
app.use('/images', express.static('backend/images'));

// Add HTTP Headers //
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

// Include all routes //
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
