var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Comment = require('./server/api/models/commentModel'),
  //Post = require('./server/api/models/postModel'),
  bp = require('body-parser');
  module.exports = app


//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/wambo');

app.use(bp.urlencoded({extended:true}));
app.use(bp.json());

var commentRoutes = require('./server/api/routes/commentRoutes');
commentRoutes(app);

var userRoutes = require('./server/api/routes/userRoutes');
userRoutes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('Lets fucking go DUDE');
