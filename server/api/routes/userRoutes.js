module.exports = function(app) {
  var userManager = require('../models/userManager');
  var commentManager = require('../models/commentManager');

  app.route('/api/users')
    .get(userManager.getAllUsers)
    .post(userManager.createUser)
    .delete(userManager.deleteAllUsers); //delete all is never used


  app.route('/api/auth/login')
    .post(userManager.getUserForLogin);


  app.route('/api/users/:userId')
    .get(userManager.getUserById)
    //.put(userManager.setUserById)
    .delete(userManager.deleteUserById);

  app.route('/api/usernames/:username')
    .get(userManager.getUserByUsername);



  app.route('/api/users/:userId/likes')
    .get(commentManager.getUserTotalReceivedLikes);

  app.route('/api/users/:userId/dislikes')
    .get(commentManager.getUserTotalReceivedDislikes);

  app.route('/api/users/:userId/comments')
    .get(commentManager.getUserTotalComments);
};
