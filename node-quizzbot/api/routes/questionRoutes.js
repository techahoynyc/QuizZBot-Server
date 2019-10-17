'use strict';
// question routes
module.exports = function(app) {
  var db = require('../controllers/queries');

  app.route('/')
   .get(db.getHome);

  app.route('/questions/:qbid')
    .get(db.getQbyQBID);
    .post(db.saveAnswer);

};