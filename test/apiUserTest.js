'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));
const app = require('../server.js'); // The server
const commentModel = require('../server/api/models/commentModel');
const userModel = require('../server/api/models/userModel');
const mongoose = require('mongoose');
var User = userModel.schema;

describe('API endpoint /api/users/:userId/likes', function() {
  var userId = new mongoose.Types.ObjectId('56cb91bdc3464f14678934ca');
  this.timeout(5000); // How long to wait for a response (ms)

  var testUser = User({
    _id: userId,
    email: 'test@test.com',
    password: 'supersafepassword'
  });

  before(function(done) {
    testUser.save(function(err, com) {
      if (err)
        throw err;
      console.log('added!');
    });
    done();
  });

  after(function(done) {
    User.findById(userId).remove(function(err, com) {
      if (err)
        throw err;
      console.log('Deleted!');
    });
    done();
  });



  // get likes of user
  it('should get a user', function() {
    // console.log('/api/users/' + userId );
    return chai.request(app)
      .get('/api/users/' + userId)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body._id).to.be.eql('56cb91bdc3464f14678934ca');
        expect(res.body.email).to.be.eql('test@test.com');
        expect(res.body.password).to.be.eql('supersafepassword')
      });
  });
});

//
// module.exports = function(app) {
//   var userManager = require('../models/userManager');
//
//   app.route('/api/users')
//     .get(userManager.getAllUsers)
//     .post(userManager.createUser)
//     .delete(userManager.deleteAllUsers); //delete all is never used
//
//   app.route('/api/users/:userId')
//     .get(userManager.getUserById)
//     //.put(userManager.setUserById)
//     .delete(userManager.deleteUserById);
//
//   app.route('/api/emails/:email')
//     .get(userManager.getUserByEmail);
//
// };


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
