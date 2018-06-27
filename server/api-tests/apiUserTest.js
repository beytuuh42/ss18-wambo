'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));
const app = require('../server.js'); // The server
const commentModel = require('../api/models/commentModel');
const userModel = require('../api/models/userModel');
const mongoose = require('mongoose');
const User = userModel.schema;
const Comment = commentModel.schema;
var bcrypt = require('bcrypt-nodejs');

//Variables for the tests
var username = 'FrankTheTank';
var userId = mongoose.Types.ObjectId('56cb91bdc3464f14678934ca');

// test API endpoint /api/users/
describe('API endpoint /api/users/', function() {
  this.timeout(5000); // How long to wait for a response (ms)
  var hashedPW =  bcrypt.hashSync('supersafepassword', bcrypt.genSaltSync(5))
  //define test user
  var testUser = User({
    _id: userId,
    username: username,
    password: 'supersafepassword'
  });

  //add testUser to database before test
  before(function(done) {
    User.remove({}, function(err) {
      done();
    });
  });

  //delete testUser from database after test
  after(function(done) {
    User.remove({}, function(err) {
      done();
    });
  });


  // create user
  it('should create a user', function() {
    return chai.request(app)
      .post('/api/users/')
      .send(testUser)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body._id).to.be.eql('56cb91bdc3464f14678934ca');
        expect(res.body.username).to.be.eql('FrankTheTank');
        expect(bcrypt.compareSync('supersafepassword', res.body.password)).to.be.true;

      });
  });

  // // create user
  // it('should report error when creating a user, no password', function() {
  //   return chai.request(app)
  //     .post('/api/users/')
  //     .send({
  //       _id: new mongoose.Types.ObjectId(),
  //       username: 'goodusername2',
  //       password: ''
  //     })
  //     .then(function(res) {
  //       console.log(res);
  //       expect(res.error).to.have.status(400);
  //       expect(res.error.text).to.be.eql('Error creating User ValidationError: password: Path `password` (`hello`) is shorter than the minimum allowed length (8).');
  //     });
  // });

  // get user by id
  it('should get a user', function() {
    return chai.request(app)
      .get('/api/users/' + userId)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body._id).to.be.eql('56cb91bdc3464f14678934ca');
        expect(res.body.username).to.be.eql('FrankTheTank');
        expect(bcrypt.compareSync('supersafepassword', res.body.password)).to.be.true;
      });
  });

  //get error when no user with this id available
  it('should get error when no user with this id available', function() {
    return chai.request(app)
      .get('/api/users/' + '2232')
      .then(function(res) {
        expect(res).to.have.status(404);
        expect(res.notFound).to.be.true;
        expect(res.error.text).to.equal('2232 not found')
      });
  });

  // get user by name
  it('should get user by name', function() {
    return chai.request(app)
      .get('/api/usernames/' + username)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body._id).to.be.eql('56cb91bdc3464f14678934ca');
        expect(res.body.username).to.be.eql('FrankTheTank');
        expect(bcrypt.compareSync('supersafepassword', res.body.password)).to.be.true;
      });
  });


  // //get error when no user available
  // it('should report error when no user found', function() {
  //   return chai.request(app)
  //     .get('/api/usernames/' + 'cangoo')
  //     .then(function(res) {
  //       // expect(res.notFound).to.be.true;
  //       expect(res.error.text).to.equal('cangoo not found')
  //     });
  // });
});


//test API endpoint /api/users/:userId

describe('API endpoint /api/users/:userId', function() {
  var commentId1 = new mongoose.Types.ObjectId('111111111111111111111111');
  var commentId2 = new mongoose.Types.ObjectId('211111111111111111111111');
  this.timeout(5000); // How long to wait for a response (ms)

  //define test user
  var testUser = User({
    _id: userId,
    username: username,
    password: 'supersafepassword'
  });


  var testComment1 = new Comment({
    _id: commentId1,
    content: 'Hey guys',
    author: userId,
    likes: 5,
    dislikes: 3
  });

  var testComment2 = new Comment({
    _id: commentId2,
    content: 'Hey guys, it‘s me again',
    author: userId,
    likes: 2,
    dislikes: 20,
  });

  //add testUser to database before test
  before(function(done) {
    User.remove({}, function(err) {});
    Comment.remove({}, function(err) {});
    testUser.save(function(err, res) {
      if (err)
        throw err;
    });
    testComment1.save(function(err, res) {
      if (err)
        throw err;
    });
    testComment2.save(function(err, res) {
      if (err)
        throw err;
    });
    done();
  });

  //delete testUser from database after test
  after(function(done) {
    User.remove({}, function(err) {});
    Comment.remove({}, function(err) {});
    done();
  });


  // get total received Likes of user
  it('should get total likes of user', function() {
    return chai.request(app)
      .get('/api/users/' + userId + '/likes')
      .then(function(res) {
        expect(res.body).to.have.nested.property('[0].total', 5 + 2);
        expect(res).to.have.status(200);
      });
  });

  // get total received dislikes of user
  it('should get total likes of user', function() {
    return chai.request(app)
      .get('/api/users/' + userId + '/dislikes')
      .then(function(res) {
        expect(res.body).to.have.nested.property('[0].total', 20 + 3);
        expect(res).to.have.status(200);
      });
  });

  // get total received dislikes of user
  it('should get total likes of user', function() {
    return chai.request(app)
      .get('/api/users/' + userId + '/comments')
      .then(function(res) {
        expect(res.body).to.have.nested.property('[0].total', 2);
        expect(res).to.have.status(200);
      });
  });
});
