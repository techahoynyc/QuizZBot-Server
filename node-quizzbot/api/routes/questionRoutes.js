'use strict';
// question routes
module.exports = function(app) {
  var db = require('../controllers/queries');

  app.route('/')
   .get(db.getHome);

  app.route('/leaderboard')
  .get(db.getLeaderboard);

  app.route('/reset')
  .get(db.resetGame);

  app.route('/questions/:qbid')
    .get(db.getQbyQBID);

  app.route('/saveAnswer')
    .post(db.saveAnswer);

};
