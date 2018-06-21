module.exports = function(app) {
  var userManager = require('../models/userManager');

  app.route('/api/users')
    .get(userManager.getAllUsers)
    .post(userManager.createUser)
    .delete(userManager.deleteAllUsers); //delete all is never used

  app.route('/api/users/:userId')
    .get(userManager.getUserById)
    //.put(userManager.setUserById)
    .delete(userManager.deleteUserById);

  app.route('/api/emails/:email')
    .get(userManager.getUserByEmail);
    
};
