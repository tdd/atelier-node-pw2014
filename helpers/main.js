module.exports = function mainHelpers(app) {
  app.use(setupHelpers);
};

function setupHelpers(req, res, next) {
  res.locals.flash = req.flash();
  next();
}
