var userModel = require('../models/userModel.js'),
    jwt    = require('jsonwebtoken'),
    User = userModel.schema,
    app = require('../../../server/server.js'),
    config = require('../../_config.js');


// QUERIES


// CREATE

//creating new User object with the given param
function createUserQuery(body) {
  return new User(body);
};

// READ

//retrieving user by id
function getUserByIdQuery(_id) {
  return User.findById(_id);
};

//retrieving user by username
function getUserByUsernameQuery(username) {
  return User.findOne({'username':username});
}

//retrieving all users
function getAllUsersQuery() {
  return User.find({});
};

// DELETE

// deleting all users
function deleteAllUsersQuery() {
  return User.remove({});
};


// EXECUTES

// CREATE

/**
  Creating a new user. check if the password's length is < 8, then hash and returning
  Check if the password's length is < 8. Hash it.
  return result as json or error message.
**/
var createUser = function(req, res) {
  req.body.admin  = true;
  if(req.body.password.length < 8){
    return false;
  }
  req.body.password = userModel.encryptPassword(req.body.password);

  createUserQuery(req.body).save(function(err, user) {
    if (err || user === null){
      res.status(400).send("Error creating User " + err );

    }
    res.json(req.body);
  });
};

// READ

// Executing the query and returning the result as json or error.
var getUserById = function(req, res) {
  getUserByIdQuery(req.params.userId).exec(function(err, com) {
    if (err || com === null){
      res.status(404).send(req.params.userId + " not found");
    }else{
    res.json(com);
    }
  });
};


// Executing the query and returning the result as json or error.
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


// Executing the query and returning the result as json or error.
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

/**
  Executing the query and returning the result as json or error.
  The json contains whether the authentification was successful or not and a
  potential token with the username and admin rights.
**/
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


    const payload = {
      admin: user.admin,
      user: user.username
    };
        var token = jwt.sign(payload, config.secret, {
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

// Executing the query and returning the result as json or error.
var deleteUserById = function(req, res) {
  getUserByIdQuery(req.params.userId).remove(function(err, com) {
    if (err){
      res.json(err);
      return Promise.reject(new Error("Error deleting user by ID in API: " + err.message));
    }
    res.json(com);
  });
}

// Executing the query and returning the result as json or error.
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
