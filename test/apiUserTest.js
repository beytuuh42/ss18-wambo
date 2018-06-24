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
  var email = 'test@test.com';
  this.timeout(5000); // How long to wait for a response (ms)

//define test user
  var testUser = User({
    _id: userId,
    email: email,
    password: 'supersafepassword'
  });

//add testUser to database before test
  before(function(done) {
    testUser.save(function(err, com) {
      if (err)
        throw err;
      console.log('added!');
    });
    done();
  });

  //delete testUser from database after test
  after(function(done) {
    User.remove({}, function(err) {
       console.log('collection removed')
       done();
    });
  });



  // get user by id
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

// get user by email
it('should get user by email', function() {
  return chai.request(app)
    .get('/api/emails/' + email)
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res.body._id).to.be.eql('56cb91bdc3464f14678934ca');
      expect(res.body.email).to.be.eql('test@test.com');
      expect(res.body.password).to.be.eql('supersafepassword')
    });
});


//get error when no user available
it('report error when no user found', function() {
  return chai.request(app)
    .get('/api/emails/' + 'no@user.com')
    .then(function(res) {
      console.log(res);
      expect(res).to.have.status(404);
      expect(res.notFound).to.be.true;
      expect(res.error.text).to.equal('no@user.com not found')
    });
});
});
