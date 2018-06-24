var userModel = require('../models/userModel.js');

var User = userModel.schema;


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
  createUserQuery(req.body).save(function(err, com) {
    if (err)
      throw err;
    res.statusCode = 201;
    res.json(com);
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
      // res.statusMessage =  "no users found"
      res.json();
    }else{
    res.json(com);
    }
    res.json(com)
  });
};

var getUserByUsername = function(req, res) {
  getUserByUsernameQuery(req.params.username).exec(function(err, com) {
    if (err || com === null){
      res.statusCode = 404;
      res.status(404).send(req.params.username + " not found");
      res.json();
    }
    
    res.json(com);
  });
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
