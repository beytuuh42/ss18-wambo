var request = require('request');

var host = 'http://localhost';
var prefix = '/api/comments/';
var port = 3000;
var method = 'GET';
var path = host + ":" + port + prefix;
var resultArr = [];
var rootMessages = [];

function requestAllPosts() {
  request(path, {
    json: true
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    getJsonAllPosts(JSON.stringify(body));
  });
};

function getJsonAllPosts(json) {
  getArrayFromJson(json);
  resultArr.sort(sortComments);
  getRootMessages(resultArr);
  //console.log(resultArr);
};

function getRootMessages(arr) {
  arr.forEach(function(post) {
    if (post.ancestors.length <= 1) {
      rootMessages.push(post);
    }
  })
  // rootMessages.forEach(function (message){
  //   test(message._id);
  // })
  test('5afee7bfdad7a55c18a9cff1');
  //console.log(rootMessages);
}

function test(parentId) {
  resultArr.forEach(function(message) {
    if (message.ancestors.length > 1) {
      if (message.ancestors.includes(parentId)) {
        console.log(message);
      }
    }
  })
};

function getArrayFromJson(json) {
  resultArr = JSON.parse(json);
}

function sortComments(a, b) {
  if (a.ancestors.length > b.ancestors.length) {
    return 1;
  }
  if (a.ancestors.length < b.ancestors.length) {
    return -1;
  }
  // a must be equal to b
  return 0;
};

exports.requestAllPosts = requestAllPosts;
exports.sortComments = sortComments;
exports.getJsonAllPosts = getJsonAllPosts;
