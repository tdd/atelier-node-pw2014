'use strict';

module.exports = function homeController(app) {
  app.get('/', function(req, res) {
    res.render('home', { title: 'Salut !' });
  });
};
