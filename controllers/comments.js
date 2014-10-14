'use strict';

module.exports = function commentsController(app) {
  app.get ('/comments',     listComments);
  app.get ('/comments/new', newComment);
  app.post('/comments',     createComment);
};

function createComment(req, res) {
  console.log('query:', req.query);
  console.log('body:', req.body);
  res.sendStatus(201);
}

function listComments(req, res) {
  res.render('comments/index', { title: 'Commentaires', comments: [] });
}

function newComment(req, res) {
  res.render('comments/new', { title: 'Nouveau commentaire' });
}
