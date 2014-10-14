'use strict';

module.exports = function commentsController(app) {
  app.get ('/comments',     listComments);
  app.get ('/comments/new', newComment);
  app.post('/comments',     createComment);
};

var Comment = require('../models/comment');

function createComment(req, res) {
  Comment.create({
    text: req.body.text
  }).then(function() {
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
  res.render('comments/new', { title: 'Nouveau commentaire', csrf: req.csrfToken() });
}
