'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('models/user');

module.exports = function usersController(app) {
  app.use(function(req, res, next) {
    if (req.user) {
      res.locals.currentUser = req.user;
    }
    next();
  });

  app.get ('/get-in',       listLoginOptions);

  app.get ('/get-in/local', localLogin);
  app.post('/get-in/local', passport.authenticate('local', {
    successRedirect: '/comments',
    failureRedirect: '/get-in/local',
    failureFlash: true
  }));

  app.get ('/logout',       logOut);
};

// Stratégie locale

passport.use(new LocalStrategy(function(userName, password, done) {
  if ('foobar' === password) {
    return User.findOrCreateByAuth(userName, userName, 'local', done);
  }

  return done(null, false, { message: 'Identifiant ou mot de passe incorrects.' });
}));

passport.serializeUser(function(id, done) {
  done(null, id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ _id: id }, done);
});

function listLoginOptions(req, res) {
  res.render('users/login_options', { title: 'Je m’identifie avec…' });
}

function localLogin(req, res) {
  res.render('users/login', { title: 'Identifie-toi', csrf: req.csrfToken() });
}

function logOut(req, res) {
  req.logout();
  req.flash('success', 'Tu as bien été déconnecté(e).');
  res.redirect('/');
}