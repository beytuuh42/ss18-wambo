module.exports = function(app) {
  var commentManager = require('../models/commentManager');

  app.route('/api/comments')
    .get(commentManager.getAllComments)
    .post(commentManager.createComment)
    .delete(commentManager.deleteAllComments); //delete all is never used

  app.route('/api/comments/:commentId')
    .get(commentManager.getCommentById)
    .put(commentManager.setCommentById)
    .delete(commentManager.deleteCommentById);

  app.route('/api/nested/:commentId')
    .get(commentManager.getNestedCommentsByParentId);

  // app.route('/api/test/:commentId')
  //   .get(commentManager.getAllParentsById);

  app.route('/api/users/:userId/likes')
    .get(commentManager.getUserTotalReceivedLikes);

  app.route('/api/users/:userId/dislikes')
    .get(commentManager.getUserTotalReceivedDislikes);

    app.route('/api/users/:userId/comments')
      .get(commentManager.getUserTotalComments);
};
