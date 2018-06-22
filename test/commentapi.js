'use strict';

const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));
const app = require('../server.js'); // Our app
describe('API endpoint /comments', function() {
  this.timeout(5000); // How long to wait for a response (ms)

  before(function() {

  });

  after(function() {

  });

  // GET - List all colors
  it('should return all posts', function() {
    return chai.request(app)
      .get('/api/comments')
      .then(function(res) {
        expect(res).to.have.status(200);
        // expect(res).to.be.arra;
        //expect(res.body).to.be.an('array');
        // expect(res.body.results).to.be.an('array');
      });
  });

  // GET - Invalid path
  it('should return Not Found', function() {
    return chai.request(app)
      .get('/INVALID_PATH')
      .catch(function(res) 0
        expect(res).to.have.status(404);
        expect(res).to.have.text('Not found')
      });
  });

  // POST - Add new comment
  it('should add new post', function() {
    return chai.request(app)
      .post('/api/comments')
      .send({
        content: 'Hey guys'
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.an('Object');
        expect(res.body).to.be.an('string').that.includes(
          'Hey guys');
          console.log(res);
       });
  });

  // POST - Bad Request
  it('should return Bad Request', function() {
    return chai.request(app)
      .post('/api/comments')
      .type('form')
      .send({
        content: 'Hey Guys'
      })
      .catch(function(err) {
        expect(err).to.have.status(400);
      });
  });
});
