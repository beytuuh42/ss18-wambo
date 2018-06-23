var commentModel = require('../models/commentModel.js');
var mongoose = require('mongoose');
var Comment = commentModel.schema;

// QUERIES


// CREATE
function createCommentQuery(body) {
  return new Comment(body);
};

// READ
function getCommentByIdQuery(_id) {
  return Comment.findById(_id);
};

function getNestedCommentSorted(value, _id, sortBy) {
  return Comment.find({
    value: _id
  }, {}, {
    $sort: {
      sortBy: 1
    }
  });
}

function getAllCommentsQuery() {
  return Comment.find({});
};

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
function setCommentByIdQuery(_id, body) {
  return Comment.findOneAndUpdate({
    _id
  }, body, {
    new: true
  });
};

// DELETE
function deleteAllCommentsQuery() {
  return Comment.collection.drop();
};



// EXECUTES


// CREATE
var createComment = function(req, res) {
  createCommentQuery(req.body).save(function(err, com) {
    if (err){
      err.statuscode = '400'
      res.json(err);
    }
    else{
      res.json(com);
    }
  });
};

//READ
var getCommentById = function(req, res) {
  getCommentByIdQuery(req.params.commentId).exec(function(err, com) {
    if (err){
      err.statuscode = '400'
      res.json(err);
    }
    else{
      res.json(com);
    }
  });
};

var getAllComments = function(req, res) {
  getAllCommentsQuery().exec(function(err, com) {
    if (err){
      err.statuscode = '400'
      res.json(err);
    }
    else{
      res.json(com);
    }
  });
};

var getUserTotalReceivedLikes = function(req, res) {
  getUserTotalReceivedLikesQuery(req.params.userId).exec(function(err,com){
    if (err){
      err.statuscode = '400'
      res.json(err);
    }
    else{
      res.json(com);
    }
  });
};


var getUserTotalReceivedDislikes = function(req, res) {
  getUserTotalReceivedDislikesQuery(req.params.userId).exec(function(err,com){
    if (err){
      err.statuscode = '400'
      res.json(err);
    }
    else{
      res.json(com);
    }
  });
};

var getUserTotalComments = function(req, res) {
  getUserTotalCommentsQuery(req.params.userId).exec(function(err,com){
    if (err){
      err.statuscode = '400'
      res.json(err);
    }
    else{
      res.json(com);
    }
  });
};

var getNestedCommentsByParentId = function(req, res) {
  var x = [];
  var curLength = 0;

  getCommentByIdQuery(req.params.commentId)
    .then((com) => {
      curLength = com.ancestors.length;
      Comment.find({
          ancestors: req.params.commentId
        }, {}, {
          $sort: {
            likes: 1
          }
        })
        .exec((err, com) => {
          if (err)
            console.log("Error finding nested comments: " + err.message);
          for (var i = 0; i < com.length; i++) {
            if (com[i].ancestors.length == curLength + 1) {
              x.push(com[i]);
            }
          }
          res.json(x);
        });
    }, (err) => {
      console.log("Error fetching nested comments: " + err.message);
    });
};

// var getAllParentsById = function(req, res) {
//   getCommentByIdQuery(req.params.commentId, 'ancestors').exec(function(err, com) {
//     if (err)
//       throw err;
//     res.json(com);
//   });
// };



//UPDATE
var setCommentById = function(req, res) {
  setCommentByIdQuery(req.params.commentId, req.body).exec(function(err, com) {
    if (err) {
      throw err;
    } else {
      res.json(com);
    }
  });
};


//DELETE
var deleteAllComments = function(req, res) {
  deleteAllCommentsQuery().exec(function(err, com){
    if(err){
      err.statuscode = '400'
      res.json(err);
    } else {
      res.json(com)
    }
  });
  console.log("Deleted all comment entries");
};

var deleteCommentById = function(req, res) {
  getCommentByIdQuery(req.params.commentId).remove(function(err, com) {
    if (err){
      err.statuscode = '400'
      res.json(err);
    }
    else{
      res.json(com);
    }
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
