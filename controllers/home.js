// Contrôleur : Accueil
// ====================

// Le mode strict c’est le bien…
'use strict';

// Mise en place
// -------------
//
// Notre module exporte une fonction qui configure le contrôleur en
// enregistrant les middleswares et routes nécessaires.
module.exports = function homeController(app) {
  // Micro-middleware qui incrémente juste un compteur de vue à chaque requête
  // GET, histoire d’illustrer les sessions en début d'atelier.
  app.use(function(req, res, next) {
    if ('GET' === req.method) {
      var views = req.session.views || 0;
      req.session.views = views + 1;
    }
    // …et on passe la main à la suite des middlewares, évidemment.
    next();
  });

  // Route unique : la page d’accueil.
  app.get('/', function(req, res) {
    res.render('home', { title: 'Salut !', views: req.session.views });
  });
};
