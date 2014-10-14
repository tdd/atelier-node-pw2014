var moment = require('moment');
var _ = require('underscore');

module.exports = function mainHelpers(app) {
  app.use(setupHelpers);
};

function setupHelpers(req, res, next) {
  res.locals.flash = req.flash();

  var lang = _.chain(req.acceptsLanguages()).invoke('split', '-').pluck(0).uniq().first().value();
  moment.locale(lang);
  _.extend(res.locals, HELPERS);

  next();
}


var HELPERS = {
  formatStamp: function formatStamp(date) {
    return moment(date).format('LLLL');
  }
};
