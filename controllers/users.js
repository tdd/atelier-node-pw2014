// Contrôleur : Authentification
// =============================

// Le mode strict c’est le bien…
'use strict';

// Mise en place
// -------------
//
// Notre module exporte une fonction qui configure le contrôleur en
// enregistrant les middleswares et routes nécessaires.
module.exports = function usersController(app) {
  // Micro-middleware qui fournit aux vues une variable `currentUser`
  // pour l'utilisateur actif fourni par Passport dans `req.user` (s'il y
  // en a un).  Utilisé notamment par la barre de nav du layout.
  app.use(function(req, res, next) {
    if (req.user) {
      res.locals.currentUser = req.user;
    }
    // Comme toujours, un middleware non-censurant passe la main à la suite.
    next();
  });

  // Route : options de login (local, Facebook, Twitter…)
  app.get ('/get-in',       listLoginOptions);

  // Routes de login local : `GET` pour le formulaire, `POST` pour l'envoi.
  app.get ('/get-in/local', localLogin);
  app.post('/get-in/local', passport.authenticate('local', {
    successRedirect: '/comments',
    failureRedirect: '/get-in/local',
    failureFlash: true
  }));

  // Routes de login OAuth : toujours la même structure par fournisseur,
  // donc on fait une boucle…
  ['facebook', 'twitter'].forEach(function(provider) {
    app.get('/get-in/' + provider, passport.authenticate(provider));
    app.get('/get-in/' + provider + '/callback', passport.authenticate(provider, {
      successRedirect: '/comments',
      failureRedirect: '/get-in',
      failureFlash: true
    }));
  });

  // Route : déconnexion
  app.get ('/logout', logOut);
};

// En temps normal je colle mes `require` tout en haut, mais pour un contrôleur/helper
// j’aime bien commencer plutôt par la fonction d'enregistrement, et laisser le corps du
// code opérationnel ensuite.
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');

// Stratégies d’authentification
// -----------------------------

// ### Stratégie locale
//
// On se contente de vérifier le mot de passe : si c'est `"foobar"`, on dit OK.
// Évidemment, ça ne marche que parce que dans cette démo, on auto-crée les comptes
// à la volée, fusionnant inscription et connexion…
passport.use(new LocalStrategy(function(userName, password, done) {
  if ('foobar' === password) {
    // Le cœur du lookup/création d'entité `User` est dans la méthode statique
    // `User.findOrCreateByAuth` qu'on a créée [dans le modèle](../models/user.html).
    return User.findOrCreateByAuth(userName, userName, 'local', done);
  }

  // Si on est ici, c’est que le mot de passe n’était pas le bon, donc on fait un rappel
  // indiquant l’invalidité des *credentials*, avec un message personnalisé.
  return done(null, false, { message: 'Identifiant ou mot de passe incorrects.' });
}));

// ### Stratégie Facebook
//
// On recourt à [passport-facebook](https://github.com/jaredhanson/passport-facebook)
// en le configurant avec une appli développeur Facebook créée pour l'occasion.
//
// **IMPORTANT** : Ne partagez pas ces clés Facebook n'importe où :
// [faites les vôtres](https://developers.facebook.com/) !  (c’est rapide et gratuit)

/* jshint maxparams:4 */
passport.use(new FacebookStrategy({
  clientID: '213376528865347',
  clientSecret: '753494ad3c02f9d9b5fb3617bbd88c1e',
  // Notez l’URL de callback, qui doit correspondre à la route qu’on a définie plus
  // haut dans la mise en place du contrôleur.
  callbackURL: '/get-in/facebook/callback'
}, function(token, tokenSecret, profile, done) {
  User.findOrCreateByAuth(profile.id, profile.displayName, 'facebook', done);
}));

// ### Stratégie Twitter
//
// On recourt à [passport-twitter](https://github.com/jaredhanson/passport-twitter)
// en le configurant avec une appli développeur Twitter créée pour l'occasion.
//
// **IMPORTANT** : Ne partagez pas ces clés Twitter n'importe où :
// [faites les vôtres](https://dev.twitter.com/apps/new) !  (c’est rapide et gratuit)

/* jshint maxparams:4 */
passport.use(new TwitterStrategy({
  consumerKey: '0mC7OanUtfH0ZHOn7xD7Aw',
  consumerSecret: 'Ch8Fy2bFgIMnnlPyB9stgTkwO06yOu4Of3PjhiDaXA',
  callbackURL: '/get-in/twitter/callback'
}, function(token, tokenSecret, profile, done) {
  User.findOrCreateByAuth('@' + profile.username, profile.displayName, 'twitter', done);
}));

// (Dé)sérialisations
// ------------------
//
// Passport a systématiquement besoin de pouvoir faire correspondre les données
// transmises en requête (par en-tête, session ou autre) pour identifier le compte
// *à un objet représentant l'utilisateur côté serveur* (ici une instance du modèle
// [`User`](../models/user.html)).  Pour cela, on doit fournir deux *hooks*, un pour
// sérialiser ce qui nous est renvoyé par le callback d’authentification vers une forme
// en session (si on a activé les sessions), et un pour désérialiser cette même info vers
// un `User` à proprement parler.

// ### Sérialisation
//
// Normalement, notre callback ici prendrait un `User` en 1er argument, mais comme notre
// callback d'authentification `User.findOrCreateByAuth` lui passe directement l'ID plutôt
// (par flemme, un peu…), on n’a rien de spécial à faire, on passe ça tel quel, ça suffira
// à identifier le compte.
passport.serializeUser(function(id, done) {
  done(null, id);
});

// ### Désérialisation
//
// La session / requête fournit donc juste l'ID (puisque c'est comme ça qu'on a sérialisé
// la fois d'avant), on va passer par la méthode statique `findOne` fournie par Mongoose
// pour récupérer le compte.
passport.deserializeUser(function(id, done) {
  User.findOne({ _id: id }, done);
});

// Gestionnaires de route
// ----------------------

// ### Modes de connexion (`GET /get-in`)
function listLoginOptions(req, res) {
  res.render('users/login_options', { title: 'Je m’identifie avec…' });
}

// ### Login local (`GET /get-in/local`)
function localLogin(req, res) {
  res.render('users/login', { title: 'Identifie-toi' });
}

// ### Déconnexion (`GET /logout`)
function logOut(req, res) {
  req.logout();
  req.flash('success', 'Tu as bien été déconnecté(e).');
  res.redirect('/');
}
