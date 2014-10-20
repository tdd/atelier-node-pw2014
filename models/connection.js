// Connexion centralisée MongoDB
// =============================

// J‘utilise pas mal ce *pattern* dans mes applis Node basées sur MongoDB,
// afin de découpler la connexion des schémas et modèles.

// Le mode strict c’est le bien…
'use strict';

var mongoose = require('mongoose');

// Mise en place
// -------------

// Le simple fait de requérir ce module tente de se connecter.
// Naturellement, en prod on utiliserait plutôt une variable d’environnement
// (genre `process.env.MONGOLAB_URI`) pour se connecter à la base. La
// syntaxe de type URL reste l'approche préférée dans tous les cas.
mongoose.connect('mongodb://localhost/nodepw14');

// Si jamais on a un souci de connexion, assurons-nous de la signaler
// sur la console d’erreur du serveur.
var db = mongoose.connection;
db.on('error', function() {
  // (Pour rappel, cet accesseur colorisant `.red` en fin de `String`
  // vient du module `colors`, requis au démarrage par `server.js`)
  console.error('✘ CANNOT CONNECT TO mongoDB DATABASE nodepw14!'.red);
});

// Callback de disponibilité
// -------------------------

// Il n'est pas nécessaire d'appeler la fonction publiée par le module
// pour initialiser la connexion, mais elle est utile si le code appelant
// veut être notifié de la disponibilité de la connexion, comme c'est le cas
// du [point d'entrée de notre serveur](../server.html).
module.exports = function(onceReady) {
  if (onceReady) {
    db.on('open', onceReady);
  }
};
