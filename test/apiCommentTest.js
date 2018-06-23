'use strict';

const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));
const app = require('../server.js'); // The server
var model = require('../server/api/models/commentModel');
var mongoose = require('mongoose');


describe('API endpoint /comments', function() {
  var commentId;

  this.timeout(5000); // How long to wait for a response (ms)

  before(function() {

  });

  after(function() {
    console.log(commentId);
    return chai.request(app)
      .delete('/api/comments/' + commentId)
      .then(function(res) {
        console.log("Deleted testcontent from database");
        expect(res).to.have.status(200);
      });
  });



  // POST - Add new comment
  it('should add new post', function() {
    return chai.request(app)
      .post('/api/comments')
      .send({
        content: 'Hey guys',
        author: mongoose.Types.ObjectId()
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.an('Object');
        expect(res.body.content).to.equal('Hey guys');
        commentId = res.body._id;
      })
  });

  // POST - Bad Request
  it('should return Bad Request', function() {
    return chai.request(app)
      .post('/api/comments')
      .type('form')
      .send({
        content: 'Hey Guys',
        author: mongoose.Types.ObjectId()
      })
      .catch(function(err) {
        expect(err).to.have.status(400);
      });
  });


  // GET - List all Comments
  it('should return all posts', function() {
    return chai.request(app)
      .get('/api/comments')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        //expect(res.body).to.be.an('array');
        // expect(res.body.results).to.be.an('array');
    });
  });

  // GET - Invalid path
  it('should return Not Found', function() {
    return chai.request(app)
      .get('/INVALID_PATH')
      .catch(function(res) {
        expect(res).to.have.status(404);
        expect(res).to.have.text('Not found')

      });
  });
});

describe('API endpoint /comments/:commentId', function() {
  var commentId;
  var commentLikes;
  var commentDislikes;

  this.timeout(5000); // How long to wait for a response (ms)

  before(function() {
      return chai.request(app)
        .post('/api/comments')
        .send({
          content: 'Hey guys',
          author: mongoose.Types.ObjectId()
        })
        .then(function(res) {
          commentId = res.body._id;
          commentLikes = res.body.likes;
          commentDislikes = res.body.dislikes;
          console.log("Added testcontent to database");
        });

  });


  // Get Comment by id
  it('should get Comment by id', function() {
    return chai.request(app)
      .get('/api/comments/' + commentId)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body.content).to.have.lengthOf.above(0);
      });
  });

//Update Comment by id
  it(' should update Post by id / increment likes and dislikes', function() {
    return chai.request(app)
      .put('/api/comments/' + commentId)
      .send({
        likes: commentLikes+1,
        dislikes: commentDislikes+1
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.an('Object');
        expect(res.body.content).to.equal('Hey guys');
        expect(res.body._id).to.equal(commentId);
        expect(res.body.likes).to.equal(1);
        expect(res.body.dislikes).to.equal(1);
      });
  });

  // Delete Comment by id
  it('should delete Post by id', function() {
    return chai.request(app)
      .delete('/api/comments/' + commentId)
      .then(function(res) {
        console.log(res);
        expect(res).to.have.status(200);
        expect(res).to.have.text('{"n":1,"ok":1}');
      })

  });
});


//
// module.exports = function(app) {
//   var commentManager = require('../models/commentManager');
//
//   app.route('/api/comments')
//     .get(commentManager.getAllComments)
//     .post(commentManager.createComment)
//     .delete(commentManager.deleteAllComments); //delete all is never used
//
//   app.route('/api/comments/:commentId')
//     .get(commentManager.getCommentById)
//     .put(commentManager.setCommentById)
//     .delete(commentManager.deleteCommentById);
//
//   app.route('/api/nested/:commentId')
//     .get(commentManager.getNestedCommentsByParentId);
//
//   // app.route('/api/test/:commentId')
//   //   .get(commentManager.getAllParentsById);
//
//   app.route('/api/users/:userId/likes')
//     .get(commentManager.getUserTotalReceivedLikes);
//
//   app.route('/api/users/:userId/dislikes')
//     .get(commentManager.getUserTotalReceivedDislikes);
//
//     app.route('/api/users/:userId/comments')
//       .get(commentManager.getUserTotalComments);
// };
