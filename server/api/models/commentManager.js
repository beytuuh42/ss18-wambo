var commentModel = require('../models/commentModel.js');
var mongoose = require('mongoose');
var Comment = commentModel.schema;

// QUERIES


// CREATE

//creating new Comment object with the given param
function createCommentQuery(body) {
  return new Comment(body);
};

// READ

//retrieving comment by id
function getCommentByIdQuery(_id) {
  return Comment.findById(_id);
};

//retrieving nested comments by id and sorting them
function getNestedCommentSorted(value, _id, sortBy) {
  return Comment.find({value: _id}, {}, {$sort: {sortBy: 1}});
}

//retrieving all comments
function getAllCommentsQuery() {
  return Comment.find({});
};

//retrieving amount of likes an user received by authorid
function getUserTotalReceivedLikesQuery(id){
  return Comment.aggregate([
    { $match: { "author": new mongoose.Types.ObjectId(id) }},
    { $group: {
      _id : null,
      total: {
        $sum : "$likes"
      }
    }}
  ]);
}

//retrieving amount of dislikes an user received by authorid
function getUserTotalReceivedDislikesQuery(id){
  return Comment.aggregate([
    { $match: { "author": new mongoose.Types.ObjectId(id) }},
    { $group: {
      _id : null,
      total: {
        $sum : "$dislikes"
      }
    }}
  ]);
}

//retrieving amount of comments an user made by authorid
function getUserTotalCommentsQuery(id){
  return Comment.aggregate([
    { $match: { "author" : new mongoose.Types.ObjectId(id) }},
    { $group: {
      _id : null,
      total: {
        $sum : 1
      }
    }}
  ])
}

// UPDATE

//changing comment by its id and body content
function setCommentByIdQuery(_id, body) {
  return Comment.findOneAndUpdate({
    _id
  }, body, {
    new: true
  });
};

//deleting all comments
// DELETE
function deleteAllCommentsQuery() {
  return Comment.remove({});
};



// EXECUTES


// CREATE

// Executing the query and returning the result as json or error.
var createComment = function(req, res) {
  createCommentQuery(req.body).save(function(err, com) {
    if (err){
      err.statuscode = '400';
      res.json(err);
      return Promise.reject(new Error("Error creating comment in API: " + err.message));
    }
    res.json(com);
  });
};

//READ

// Executing the query and returning the result as json or error.
var getCommentById = function(req, res) {
  getCommentByIdQuery(req.params.commentId).exec(function(err, com) {
    if (err){
      err.statuscode = '400';
      res.json(err);
      return Promise.reject(new Error("Error finding comment by id in API: " + err.message));
    }
    res.json(com);
  });
};


// Executing the query and returning the result as json or error.
var getAllComments = function(req, res) {
  getAllCommentsQuery().exec(function(err, com) {
    if (err){
      err.statuscode = '400'
      res.json(err);
      return Promise.reject(new Error("Error fetching all comments in API: " + err.message));
    } else {
      res.json(com);
    }
  });
};
// Executing the query and returning the result as json or error.
var getUserTotalReceivedLikes = function(req, res) {
  getUserTotalReceivedLikesQuery(req.params.userId).exec(function(err,com){
    if (err){
      err.statuscode = '400';
      res.json(err);
      return Promise.reject(new Error("Error fetching total likes in API: " + err.message));
    }
    res.json(com);
  });
};

// Executing the query and returning the result as json or error.
var getUserTotalReceivedDislikes = function(req, res) {
  getUserTotalReceivedDislikesQuery(req.params.userId).exec(function(err,com){
    if (err){
      err.statuscode = '400';
      res.json(err);
      return Promise.reject(new Error("Error fetching total dilikes in API: " + err.message));
    }
    res.json(com);
  });
};
// Executing the query and returning the result as json or error.
var getUserTotalComments = function(req, res) {
  getUserTotalCommentsQuery(req.params.userId).exec(function(err,com){
    if (err){
      err.statuscode = '400';
      res.json(err);
      return Promise.reject(new Error("Error fetching total comments in API: " + err.message));
    }
    res.json(com);
  })
}

// Find all descendant of a parent comment, push them in an array and return it
var getNestedCommentsByParentId = function(req, res) {
  var x = [];
  var curLength = 0;

  getCommentByIdQuery(req.params.commentId)
    .then((com) => {
      curLength = com.ancestors.length;
      Comment.find({ancestors: req.params.commentId}, {}, {$sort: {created_at: 1}})
        .exec((err, com, next) => {
          if (err){
            err.statuscode = '400';
            res.json(err);
            return Promise.reject(new Error("Error finding ancestors in API: " + err.message));
          }

          for (var i = 0; i < com.length; i++) {
            if (com[i].ancestors.length == curLength + 1) {
              x.push(com[i]);
            }
          }
          res.json(x);
        });
    }, (err) => {
      err.statuscode = '400';
      res.json(err);
      return Promise.reject(new Error("Error fetching nested comments in API: " + err.message));
    });
};



//UPDATE

// Executing the query and returning the result as json or error.
var setCommentById = function(req, res) {
  setCommentByIdQuery(req.params.commentId, req.body).exec(function(err, com) {
    if (err){
      err.statuscode = '400';
      res.json(err);
      return Promise.reject(new Error("Error changing comment by ID in API: " + err.message));
    }
    res.json(com);
  });
};


//DELETE

// Executing the query and returning the result as json or error.
var deleteAllComments = function(req, res) {
  deleteAllCommentsQuery().exec(function(err, com){
    if (err){
      err.statuscode = '400';
      res.json(err);
      return Promise.reject(new Error("Error deleting all comments in API: " + err.message));
    }
    res.json(com);
  });
};

// Executing the query and returning the result as json or error.
var deleteCommentById = function(req, res) {
  getCommentByIdQuery(req.params.commentId).remove(function(err, com) {
    if (err){
      err.statuscode = '400';
      res.json(err);
      return Promise.reject(new Error("Error deleting comment by ID in API: " + err.message));
    }
    res.json(com);
  });
};

exports.createComment = createComment;
exports.getCommentById = getCommentById;
exports.getAllComments = getAllComments;
exports.setCommentById = setCommentById;
exports.deleteAllComments = deleteAllComments;
exports.deleteCommentById = deleteCommentById;
exports.getNestedCommentsByParentId = getNestedCommentsByParentId;
exports.getUserTotalReceivedLikes = getUserTotalReceivedLikes;
exports.getUserTotalReceivedDislikes = getUserTotalReceivedDislikes;
exports.getUserTotalComments = getUserTotalComments;
// exports.getAllParentsById = getAllParentsById;
