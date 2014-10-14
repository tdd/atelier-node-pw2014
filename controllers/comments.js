'use strict';

module.exports = function commentsController(app) {
  app.get ('/comments',     listComments);
  app.get ('/comments/new', newComment);
  app.post('/comments',     createComment);
};

function createComment(req, res) {
  var body = (req.body.text || '').trim();
  if (body) {
    req.flash('success', 'Ton commentaire a bien été ajouté.');
    res.redirect('/comments');
  } else {
    req.flash('error', 'Si tu mettais un texte ce serait mieux…');
    res.locals.flash = req.flash();
    res.status(400);
    newComment(req, res);
  }
}

function listComments(req, res) {
  res.render('comments/index', { title: 'Commentaires', comments: [] });
}

function newComment(req, res) {
  res.render('comments/new', { title: 'Nouveau commentaire', csrf: req.csrfToken() });
}
