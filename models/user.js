// Modèle : Commentaire
// ====================

// Le mode strict c’est le bien…
'use strict';

var mongoose = require('mongoose');

// Schéma
// ------
//
// Mongoose nous fait définir des [schémas](http://mongoosejs.com/docs/guide.html)
// qui représentent la structure, les règles, la validation et les
// extensions de méthodes de nos documents.  C’est extrêmement utile, et
// les possibilités sont particulièrement riches.
var userSchema = mongoose.Schema({
  // Au lieu de la clé primaire par défaut (un [ObjectId](http://docs.mongodb.org/manual/reference/object-id/)),
  // on utilisera ici une valeur issue du fournisseur d'authentification (ex. local, Facebook, Twitter),
  // ce qui d'ailleurs pourrait bien poser souci si on rajoutait des fournisseurs dont les clés
  // rentrent en conflit, mais pour la démo, ici, ça suffira…
  _id:      String,
  // Le nom complet (si on peut l'avoir via le *callback* OAuth) de l'utilisateur.
  name:     String,
  // Le fournisseur d'authentification.  Dans notre démo, ce sera `'local'`, `'facebook'` ou
  // `'twitter'`.
  provider: String,
  // Le moment de création du compte, avec sa valeur par défaut.
  joinedAt: { type: Date, default: Date.now }
});

// Méthodes statiques custom
// -------------------------
//
// Tout ajout à la propriété `statics` du schéma équipe les modèles dérivés de ces méthodes
// statiques.  On aurait la même chose en mode instance avec la propriété `methods` du schéma.

// ### Callback finalisant l’authentification
//
// Lors des callbacks d'authentification de Passport, quelle que soit la stratégie, il nous
// délègue l'obtention de l'objet représentant l'utilisateur.  C'est généralement asynchrone…
// Ici on récupère l'ID, le nom complet éventuel, le fournisseur, et un callback de Passport
// qui est censé prendre une erreur éventuelle en premier (convention Node) et l'instance
// `User` en cas de succès en second.

// On a ici fait le choix, assez rare en pratique, de fusionner inscription (*sign in*) et
// connexion (*log in*) : si le compte n'existe pas, on le crée à la volée.  Y'a des services
// ou c'est une approche très sympa.  C'est aussi pour nous l'occasion de montrer une fonctionnalité
// sympa de MongoDB en action : [l’upsert](http://docs.mongodb.org/manual/tutorial/modify-documents/#upsert-option)
// qui tente une mise à jour, et si elle ne trouve pas l'entrée, l'insère à la volée, tout ça de
// façon atomique.

/* jshint maxparams:4 */
userSchema.statics.findOrCreateByAuth = function findOrCreateByAuth(id, name, provider, done) {
  var User = this;
  User.update(
    // Critères de recherche
    { _id: id, provider : provider },
    // Infos pour la mise à jour (si on a trouvé *via* la recherche)
    { name: name, provider: provider },
    // Activation du mode upsert (insertion si non trouvé)
    { upsert: true },
    // Forwarder l'erreur éventuelle, mais à défaut transmettre l'id comme valeur résultante.
    function(err, numAffected, details) {
      if (err) {
        return done(err);
      }

      // Si on existait déjà, et qu'on est donc à jour, renvoyer l'ID
      // (et non l'entité `User`, qu'on n'a d'ailleurs pas sous la main là tout de suite,
      // c'est pourquoi le [contrôleur d'authentification](../controllers/users.html))
      // sérialise sans rien faire : on lui passe déjà l'ID, et non le modèle, il le reprend
      // tel quel).
      if (details.updatedExisting) {
        return done(null, id);
      }

      // L'upsert n'aura pas forcé les defaults…  On les met à jour ici.  Un peu dommage
      // et discutable pour le coup, mais bon, on compense…
      User.update(
        { _id: id, provider: provider },
        { joinedAt: Date.now() },
        null,
        function(err) { done(err, id); }
      );
    });
};

// Export du modèle
// ----------------

// Chaque module de modèle publie un modèle Mongoose basé sur le schéma ainsi défini.
// Pour en savoir plus sur la distinction entre schéma et modèle dans Mongoose,
// [jetez un œil par ici](http://mongoosejs.com/docs/models.html).
module.exports = mongoose.model('User', userSchema);
