// Helpers
// =======

// Le mode strict c’est le bien…
'use strict';

// Mise en place
// -------------
//
// Notre module exporte une fonction qui configure le contrôleur en
// enregistrant les middlewares et routes nécessaires.
module.exports = function mainHelpers(app) {
  // Un seul middleware, qui est là pour injecter toutes les infos nécessaires dans les
  // variables de vue pour la réponse.
  app.use(setupHelpers);
};

var moment = require('moment');
var _ = require('underscore');

// Middleware d’injection
// ----------------------

function setupHelpers(req, res, next) {
  // On publie le flash dans `flash` et le token CSRF dans `csrf`.
  res.locals.flash = req.flash();
  res.locals.csrf = req.csrfToken();

  // On prend également le premier code de langue préféré par le navigateur (en retirant les
  // suffixes de pays pour se concentrer sur les codes ISO-3166-2 de langue), et on configure
  // [Moment.js](http://momentjs.com/) avec, pour que les formatages des helpers respectent
  // la préférence.

  // (Si nos comptes utilisateurs avaient un champ de préférence, on lui donnerait la préférence,
  // en regardant par exemple `req.user && req.user.language`.)

  // Remarquez au passage l'intérêt d'[Underscore](http://underscorejs.org/) sur ce coup, qui
  // nous épargne un code long, verbeux et potentiellement bogué pour le même algo…
  var lang = _.chain(req.acceptsLanguages()).invoke('split', '-').pluck(0).uniq().first().value();
  moment.locale(lang);

  // L’injection des fonctions helpers à proprement parler.
  _.extend(res.locals, HELPERS);

  // Et bien sûr, on passe la main à la suite des middlewares…
  next();
}

// Fonctions helpers
// -----------------

var HELPERS = {
  // Formatage d’horodatage de commentaire (ex. listing)
  formatStamp: function formatStamp(date) {
    // On utilise le code spécial `LLLL` qui reprend les conventions de formatage
    // de la langue active pour Moment.  Par exemple, en français, on aurait un truc
    // du genre « samedi 18 octobre 2014 16:45 » alors qu'en anglais ça donnerait plutôt
    // “Saturday October 18, 2014 4:45PM”.
    return moment(date).format('LLLL');
  }
};
