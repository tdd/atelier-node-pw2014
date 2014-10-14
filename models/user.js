'use strict';

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  _id:      String,
  name:     String,
  provider: String,
  joinedAt: { type: Date, default: Date.now }
});

/* jshint maxparams:4 */
userSchema.statics.findOrCreateByAuth = function findOrCreateByAuth(id, name, provider, done) {
  var User = this;
  User.update(
    // Recherche
    { _id: id, provider : provider },
    // Mise à jour (l'id est supposé être celui de la recherche)
    { name: name, provider: provider },
    // Activation du mode upsert (insertion si non trouvé)
    { upsert: true },
    // Forwarder l'erreur éventuelle, mais à défaut transmettre l'id comme valeur résultante.
    function(err, numAffected, details) {
      if (err) {
        return done(err);
      }

      if (details.updatedExisting) {
        return done(null, id);
      }

      // L'upsert n'aura pas forcé les defaults…  On les met à jour ici.
      User.update(
        { _id: id, provider: provider },
        { joinedAt: Date.now() },
        null,
        function(err) { done(err, id); }
      );
    });
};

module.exports = mongoose.model('User', userSchema);
