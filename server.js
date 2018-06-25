var config = require('./server/_config.js'),
  express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  morgan      = require('morgan');
  Comment = require('./server/api/models/commentModel'),
  //Post = require('./server/api/models/postModel'),
  bp = require('body-parser');
  module.exports = app;

  // *** Mongoose environment *** ///
  var db = mongoose.connect(config.mongoURI[app.settings.env], function(err, res) {
    if (err) {
      console.log('Error connecting to the database. ' + err);
    } else {
      console.log('Connected to Database: ' + config.mongoURI[app.settings.env]);
    }
  });

app.set('superSecret',config.secret);

app.use(bp.urlencoded({extended:true}));
app.use(bp.json());

app.use(morgan('dev'));

var commentRoutes = require('./server/api/routes/commentRoutes');
commentRoutes(app);

var userRoutes = require('./server/api/routes/userRoutes');
userRoutes(app);

// var authenticateRoutes = require('./server/api/routes/authenticateRoutes');
// authenticateRoutes(app);



app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('Starting application..');

exports.app = app;
