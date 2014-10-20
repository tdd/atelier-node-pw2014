'use strict';

module.exports = function commentsController(app) {
  app.use('/comments', function(req, res, next) {
    if (req.user) {
      return next();
    }

    req.flash('info', 'Tu dois être authentifié(e) pour accéder aux commentaires.');
    res.redirect('/get-in');
  });

  app.get ('/comments',     listComments);
  app.get ('/comments/new', newComment);
  app.post('/comments',     createComment);
};

var Comment = require('../models/comment');
var realTime = require('./web-sockets');

function createComment(req, res) {
  Comment.create({
    author: req.user.id,
    text: req.body.text
  }).then(function(comment) {
    var notif = comment.toJSON();
    notif.author = req.user;
    res.render('comments/_comment', { comment: notif }, function(err, html) {
      // Ignore errors for now
      if (html) {
        realTime.sockets.emit('new-comment', html.trim());
      }
    });

    req.flash('success', 'Ton commentaire a bien été ajouté.');
    res.redirect('/comments');
  }).then(null, function(error) {
    console.error(error);
    req.flash('error', 'Si tu mettais un texte ce serait mieux…');
    res.locals.flash = req.flash();
    res.status(400);
    newComment(req, res);
  });
}

function listComments(req, res) {
  Comment.getAll()
  .then(function(comments) {
    res.render('comments/index', { title: 'Commentaires', comments: comments });
  });
}

function newComment(req, res) {
  res.render('comments/new', { title: 'Nouveau commentaire' });
}
