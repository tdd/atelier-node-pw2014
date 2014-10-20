// Contrôleur : Commentaires
// =========================

// Le mode strict c’est le bien…
'use strict';

// Mise en place
// -------------
//
// Notre module exporte une fonction qui configure le contrôleur en
// enregistrant les middleswares et routes nécessaires.
module.exports = function commentsController(app) {
  // Middleware exigeant l’authentification.
  app.use('/comments', function(req, res, next) {
    // On a bien un `req.user` ? Cool ! On passe à la suite.
    if (req.user) {
      return next();
    }

    // Ah, on n‘en a pas ?  Un p'tit message et direct à la page de login.
    req.flash('info', 'Tu dois être authentifié(e) pour accéder aux commentaires.');
    res.redirect('/get-in');
  });

  // Routes : listing, formulaire d'ajout, création à proprement parler.
  //
  // **Note** : en déportant chaque action dans sa déclaration de fonction propre plus loin
  // dans le module, on conserve une « table de routage » toute concise, bien lisible.
  // Nettement mieux qu’en collant les fonctions de rappel à la volée…
  app.get ('/comments',     listComments);
  app.get ('/comments/new', newComment);
  app.post('/comments',     createComment);
};

// Gestionnaires de routes
// -----------------------

// En temps normal je colle mes `require` tout en haut, mais pour un contrôleur/helper
// j’aime bien commencer plutôt par la fonction d'enregistrement, et laisser le corps du
// code opérationnel ensuite.
var Comment = require('../models/comment');
var realTime = require('./web-sockets');

// ### Création (`POST /comments/new`)
function createComment(req, res) {
  // On passe par la méthode statique `create` fourni par [Mongoose](http://mongoosejs.com/)
  // sur ses modèles, qui renvoie une [promesse](http://www.html5rocks.com/fr/tutorials/es6/promises/),
  // ce qui nous permet de chaîner proprement les traitements en cas de succès
  // et d'échec, même s'ils sont asynchrone, sans imbriquer à n'en plus finir des
  // fonctions de rappel…
  Comment.create({
    author: req.user.id,
    text: req.body.text
  }).then(function(comment) {
    // On va notifier tout le monde du nouveau commentaire grâce aux Web Sockets.
    // Pour ça, on va faire un *rendering* du fragment Jade associé directement dans une
    // `String` (au lieu que ce soit dans notre corps de réponse) : il suffit de passer une
    // fonction de rappel en 3ème argument à `res.render`.
    var notif = comment.toJSON();
    notif.author = req.user;
    res.render('comments/_comment', { comment: notif }, function(err, html) {
      // Bon, si on voulait vraiment se blinder, on vérifierait et traiterait une
      // éventuelle erreur (`err`) ici, mais bon…
      if (html) {
        // « Hey tout le monde, y'a un nouveau commentaire ! » (avec le HTML en complément)
        // Cet événement sera écouté [côté client](../public/node-demo.html).
        realTime.sockets.emit('new-comment', html.trim());
      }
    });

    // Bon, bin en tout cas, tout s'est bien passé, alors on le dit et on redirige
    // sur le listing (en vertu du [Post-Redirect-Get](http://fr.wikipedia.org/wiki/Post-Redirect-Get)).
    req.flash('success', 'Ton commentaire a bien été ajouté.');
    res.redirect('/comments');
  }).then(null, function(error) {
    // Si on est ici, soit le `create` a échoué, soit on a fait une connerie dans le `then`
    // (la branche de succès du `create`).  Logons déjà ça en console serveur…
    console.error(error);
    // …et couinons auprès de l'utilisateur.  Comme on va refaire le *rendering* directement,
    // sans redirection, pas besoin d’écrire dans le flash pour relire immédiatement : autant
    // définir la variable de vue directement…
    res.locals.flash = { error: 'Si tu mettais un texte ce serait mieux…' };
    // HTTP code 400 : Bad Request (toujours utiliser un code approprié)
    res.status(400);
    // …après quoi c’est comme un affichage normal de formulaire d'ajout, alors déléguons !
    newComment(req, res);
  });
}

// ### Listing (`GET /comments`)
function listComments(req, res) {
  // C’est nous qui avons [défini](../models/comment.html) `getAll` comme méthode statique
  // du modèle de commentaire.  C’est une fine surcouche de `.find`.
  Comment.getAll()
  .then(function(comments) {
    res.render('comments/index', { title: 'Commentaires', comments: comments });
  });
}

// ### Formulaire d’ajout (`GET /comments/new`)
function newComment(req, res) {
  res.render('comments/new', { title: 'Nouveau commentaire' });
}
