'use strict';

module.exports = function homeController(app) {
  app.get('/', function(req, res) {
    res.send('Express te dit bonjour !');
  });
};
