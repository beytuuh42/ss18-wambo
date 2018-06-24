var userModel = require('../models/userModel.js'),
    jwt    = require('jsonwebtoken'),
    User = userModel.schema,
    app = require('../../../server.js'),
    config = require('../../_config.js');


// QUERIES


// CREATE
function createUserQuery(body) {
  return new User(body);
};

// READ
function getUserByIdQuery(_id) {
  return User.findById(_id);
};

function getUserByUsernameQuery(username) {
  return User.findOne({'username':username});
}

function getAllUsersQuery() {
  return User.find({});
};

// DELETE
function deleteAllUsersQuery() {
  return User.remove({});
};


// EXECUTES

// CREATE
var createUser = function(req, res) {
  req.body.admin  = true;
  req.body.password = userModel.encryptPassword(req.body.password);

  createUserQuery(req.body).save(function(err, user) {
    if (err || com === null){
      res.status(400).send("Error creating User " + err );

    }
    res.json(req.body);
  });
};

// READ
var getUserById = function(req, res) {
  getUserByIdQuery(req.params.userId).exec(function(err, com) {
    if (err || com === null){
      res.status(404).send(req.params.userId + " not found");
    }else{
    res.json(com);
    }
  });
};

var getAllUsers = function(req, res) {
  getAllUsersQuery().exec(function(err, com) {
    if (err || com === null){
      res.statusCode = 404;
      //res.statusMessage =  "no users found"
      res.status(404).send("Coudln't get all users");
    }else{
      res.json(com);
    }
  });
};

var getUserByUsername = function(req, res) {
  getUserByUsernameQuery(req.params.username).exec(function(err, com) {
    var user = req.params.username;
    if (err){
      res.statusCode = 404;
      res.status(404).send(user + " not found");
    } else {
      if(user){
      }
      res.json(com);
    }
  });
}

var getUserForLogin = function(req, res){
  getUserByUsernameQuery(req.body.username).exec(function(err, user) {

    if (err) {
        console.log("user find error");
        throw err;
    }

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (!user.validPassword(req.body.password)) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token with only our given payload
    // we don't want to pass in the entire user since that has the password
    const payload = {
      admin: user.admin,
      user: user.username
    };
        var token = jwt.sign(payload, "plusultra", {
          expiresIn: 86400 // expires in 24 hours
        });

        // return the information including token as JSON
        res.cookie(200).json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  })
}

// DELETE

var deleteUserById = function(req, res) {
  getUserByIdQuery(req.params.userId).remove(function(err, com) {
    if (err){
      res.json(err);
      return Promise.reject(new Error("Error deleting user by ID in API: " + err.message));
    }
    res.json(com);
  });
}
var deleteAllUsers = function(req, res) {
  deleteAllUsersQuery().exec(function(err, com){
    if (err){
      res.json(err);
      return Promise.reject(new Error("Error deleting all  users in API: " + err.message));
    }
    res.json(com);
  });
};

exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.getUserByUsername = getUserByUsername;
exports.deleteUserById = deleteUserById;
exports.deleteAllUsers = deleteAllUsers;
exports.getUserForLogin = getUserForLogin;
