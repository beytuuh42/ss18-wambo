var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var schema = new Schema({
    content: {
      type:String,
      required:true
    },
    likes: {
      type:Number,
      default:0,
      required:true
    },
    dislikes: {
      type:Number,
      default:0,
      required:true
    },
    ancestors: {
      type:[ObjectId],
      default:null
    },
    parent: {
      type:ObjectId,
      default:null,
    },
    //author: ObjectId,
    created_at:{
      type:Date,
      default:Date.now
    }
});
var Comment = mongoose.model('Comments', schema);

// Queries

// CREATE
function createCommentQuery(body){
  return new Comment(body);
};

// READ
function getCommentByIdQuery(_id, value){
  return Comment.findById(_id, value);
};

function getNestedCommentSorted(value,_id,sortBy){
  return Comment.find({value:_id}, {}, {$sort: {sortBy: 1}});
}

function getAllCommentsQuery(){
  return Comment.find({});
};

// UPDATE
function setCommentByIdQuery(_id,body){
  return Comment.findOneAndUpdate({_id},body,{new:true});
};

// DELETE
function deleteAllCommentsQuery(){
  return Comment.collection.drop();
};



// EXECUTES

// CREATE
var createComment = function(req, res){
  createCommentQuery(req.body).save(function(err, com){
    if(err)
      throw err;
    res.json(com);
  });
};

//READ
var getCommentById = function(req, res){
  getCommentByIdQuery(req.params.commentId,'').exec(function(err, com){
    if(err)
      throw err;
    res.json(com);
  });
};
var getAllComments = function(req, res){
  getAllCommentsQuery().exec(function(err, com){
    if(err){
      throw err;
    } else {
      res.json(com);
    }
  });
};

//UPDATE
var setCommentById = function(req, res){
  setCommentByIdQuery(req.params.commentId,req.body).exec(function(err, com){
    if(err)
      throw err;
    res.json(com);
  });
};

//DELETE
var deleteAllComments = function(req, res){
  deleteAllCommentsQuery().exec(function(err,com){
    if(err)
      throw err;
    console.log('Deleted!');
    res.json(com);
  });
};
var deleteCommentById = function(req, res){
  getCommentByIdQuery(req.params.commentId,'').remove(function(err,com){
    if(err)
      throw err;
    console.log('Deleted!');
    res.json(com);
  });
}

var getAllParentsById = function(req,res){
  getCommentByIdQuery(req.params.commentId,'ancestors').exec(function(err,com){
    if(err)
      throw err;
    res.json(com);
  });
};

var getNestedCommentsByParentId = function(req, res){
  var x = [];
  var curLength;

  getCommentByIdQuery(req.params.commentId,'').exec(
    function(err,com){
      if(err)
        return console.log(err);
      curLength = com.ancestors.length;
      console.log("1: " + curLength);
  });

  console.log("2: "+ curLength);

  // FIX ISSUE WHERE CUR LENGTH IS UNDEFINED (async)
  getNestedCommentSorted("ancestors",req.params.commentId,"likes").exec(
    function(err, com){
      if(err)
        throw err;
      for(var i = 0; i < com.length; i++){
          if(com[i].ancestors.length == curLength + 1){
            x.push(com[i]);
          }
      }
      res.json(x);
    });
};

exports.schema = mongoose.model('Comments', schema);
exports.createComment = createComment;
exports.getCommentById = getCommentById;
exports.getAllComments = getAllComments;
exports.setCommentById = setCommentById;
exports.deleteAllComments = deleteAllComments;
exports.deleteCommentById = deleteCommentById;
exports.getAllParentsById = getAllParentsById;
exports.getNestedCommentsByParentId = getNestedCommentsByParentId;
