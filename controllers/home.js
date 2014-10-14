'use strict';

module.exports = function homeController(app) {
  app.use(function(req, res, next) {
    if ('GET' === req.method) {
      var views = req.session.views || 0;
      req.session.views = ++views;
    }
    next();
  });

  app.get('/', function(req, res) {
    res.render('home', { title: 'Salut !', views: req.session.views });
  });
};
