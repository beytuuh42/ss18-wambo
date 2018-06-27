// routing of the queries

module.exports = function(app) {
  var commentManager = require('../models/commentManager');

  app.route('/api/comments')
    .get(commentManager.getAllComments)
    .post(commentManager.createComment)
    .delete(commentManager.deleteAllComments);

  app.route('/api/comments/:commentId')
    .get(commentManager.getCommentById)
    .put(commentManager.setCommentById)
    .delete(commentManager.deleteCommentById);

  app.route('/api/nested-comments/:commentId')
    .get(commentManager.getNestedCommentsByParentId);

};
