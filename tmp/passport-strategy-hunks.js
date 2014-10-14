var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

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
