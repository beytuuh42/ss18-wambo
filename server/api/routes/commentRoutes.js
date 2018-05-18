module.exports = function(app){
  var comment = require('../models/commentModel');

  app.route('/api/comments')
    .get(comment.getAllComments)
    .post(comment.createComment)
    .delete(comment.deleteAllComments);

  app.route('/api/comments/:commentId')
    .get(comment.getCommentById)
    .put(comment.setCommentById)
    .delete(comment.deleteCommentById);

  app.route('/api/qwe/:commentId')
    .get(comment.getNestedCommentsByParentId);

  app.route('/api/test/:commentId')
    .get(comment.getAllParentsById);
};
