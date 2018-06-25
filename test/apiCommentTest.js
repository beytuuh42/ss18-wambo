'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));
const app = require('../server.js');
const mongoose = require('mongoose');
const commentModel = require('../server/api/models/commentModel');
const Comment = commentModel.schema;

var db = mongoose.connection;

describe('API endpoint /comments', function() {
  var commentId = new mongoose.Types.ObjectId('211111111111111111111111')
  var userId = new mongoose.Types.ObjectId('111111111111111111111111')

  this.timeout(5000); // How long to wait for a response (ms)

  before(function(done) {
    Comment.remove({}, function(err) {
       console.log('collection removed')
       done();
    });
  });

  after(function(done){
    Comment.remove({}, function(err) {
       console.log('collection removed')
       done();
    });
  });

  // POST - Add new comment
  it('should add new post', function() {
    return chai.request(app)
      .post('/api/comments')
      .send({
        _id: commentId,
        content: 'Hey guys',
        author: userId
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.content).to.equal('Hey guys');
        expect(res.body._id).to.equal('211111111111111111111111');
        expect(res.body.author).to.equal('111111111111111111111111');
      })
  });

  // POST - Bad Request
  it('should return Bad Request', function() {
    return chai.request(app)
      .post('/api/comments')
      .type('form')
      .send({
        content: 'Hey Guys',
        author: userId
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
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(1)
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


//Tesing api endpoint /comments/:commentId
describe('API endpoint /comments/:commentId', function() {
  var commentId = new mongoose.Types.ObjectId('111111111111111111111111');
  var commentLikes;
  var commentDislikes;

  var testComment = new Comment({
    _id: commentId,
    content: 'Hey guys',
    author: new mongoose.Types.ObjectId('211111111111111111111111')
  });

  // How long to wait for a response
  this.timeout(5000);

  before(function(done){
    testComment.save(function(err, com) {
      if (err)
        throw err;
    });
    done();
  });

  after(function(done){
    Comment.remove({}, function(err) {
       console.log('collection removed')
       done();
    });
  });

  // Get Comment by id
  it('should get Comment by id', function() {
    return chai.request(app)
      .get('/api/comments/' + commentId)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.content).to.equal('Hey guys');
        expect(res.body._id).to.equal('111111111111111111111111');
        expect(res.body.author).to.equal('211111111111111111111111')

      });
  });

//Update Comment by id
  it(' should update Post by id / increment likes and dislikes', function() {
    return chai.request(app)
      .put('/api/comments/' + commentId)
      .send({
        likes: +1,
        dislikes: +1
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.content).to.equal('Hey guys');
        expect(res.body._id).to.eql('111111111111111111111111');
        expect(res.body.likes).to.equal(1);
        expect(res.body.dislikes).to.equal(1);
      });
  });

  // Delete Comment by id
  it('should delete Post by id', function() {
    return chai.request(app)
      .delete('/api/comments/' + commentId)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.eql({ n: 1, ok: 1 });
      })

  });
});


describe('API endpoint /nested/:commentId', function() {
  var author = mongoose.Types.ObjectId('56cb91bdc3464f14678934ca');
  var commentIdChild1 =  mongoose.Types.ObjectId('56cb91bdc3464f14678934c1');
  var commentIdChild2 =  mongoose.Types.ObjectId('56cb91bdc3464f14678934c3');
  var commentIdParent = mongoose.Types.ObjectId('56cb91bdc3464f14678934c2');
  var ancestorsChild1 = [commentIdParent, commentIdChild1];
  var ancestorsChild2 = [commentIdParent, commentIdChild2];

  var parentPost = new Comment({
    content: 'parent',
    author: author,
    _id: commentIdParent,
    ancestors: commentIdParent,
  })

  var child1 = new Comment({
    content: 'child',
    author: author,
    _id: commentIdChild1,
    ancestors: ancestorsChild1
  })

  var child2 = new Comment({
    content: 'child2',
    author: author,
    _id: commentIdChild2,
    ancestors: ancestorsChild2
  })


  this.timeout(5000); // How long to wait for a response (ms)

  before(function(done) {
    parentPost.save(function(err, res) {
      if (err)
        throw err;
    });
    child1.save(function(err, res) {
      if (err)
        throw err;
    });
    child2.save(function(err, res) {
      if (err)
        throw err;
    });
    done();
  });

after(function(done){
  Comment.remove({}, function(err) {
     console.log('collection removed')
  });
  done();
});

  // get child comments of post
  it('should get children ids of post', function() {
    return chai.request(app)
      .get('/api/nested/' + commentIdParent)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.nested.property('[0]._id', '56cb91bdc3464f14678934c1' );
        expect(res.body).to.have.nested.property('[1]._id', '56cb91bdc3464f14678934c3' );
      })

  });
});
