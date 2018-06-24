module.exports = function(app) {
  var userManager = require('../models/userManager');

  app.route('/api/login')
    .post(userManager.getUserForLogin);
};
