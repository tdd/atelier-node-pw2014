'use strict';

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
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

  ['facebook', 'twitter'].forEach(function(provider) {
    app.get('/get-in/' + provider, passport.authenticate(provider));
    app.get('/get-in/' + provider + '/callback', passport.authenticate(provider, {
      successRedirect: '/comments',
      failureRedirect: '/get-in',
      failureFlash: true
    }));
  });

  app.get ('/logout',       logOut);
};

// Stratégie locale

passport.use(new LocalStrategy(function(userName, password, done) {
  if ('foobar' === password) {
    return User.findOrCreateByAuth(userName, userName, 'local', done);
  }

  return done(null, false, { message: 'Identifiant ou mot de passe incorrects.' });
}));

// Stratégie Facebook

/* jshint maxparams:4 */
passport.use(new FacebookStrategy({
  // **Ne partagez pas ces clés Facebook n'importe où : [faites les vôtres](https://developers.facebook.com/) !**
  clientID: '213376528865347',
  clientSecret: '753494ad3c02f9d9b5fb3617bbd88c1e',
  callbackURL: '/get-in/facebook/callback'
}, function(token, tokenSecret, profile, done) {
  User.findOrCreateByAuth(profile.id, profile.displayName, 'facebook', done);
}));

// Stratégie Twitter

/* jshint maxparams:4 */
passport.use(new TwitterStrategy({
  // **Ne partagez pas ces clés Twitter n'importe où : [faites les vôtres](https://dev.twitter.com/apps/new) !**
  consumerKey: '0mC7OanUtfH0ZHOn7xD7Aw',
  consumerSecret: 'Ch8Fy2bFgIMnnlPyB9stgTkwO06yOu4Of3PjhiDaXA',
  callbackURL: '/get-in/twitter/callback'
}, function(token, tokenSecret, profile, done) {
  User.findOrCreateByAuth('@' + profile.username, profile.displayName, 'twitter', done);
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
  res.render('users/login', { title: 'Identifie-toi' });
}

function logOut(req, res) {
  req.logout();
  req.flash('success', 'Tu as bien été déconnecté(e).');
  res.redirect('/');
}
