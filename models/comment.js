// Modèle : Commentaire
// ====================

// Le mode strict c’est le bien…
'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');

// Schéma
// ------
//
// Mongoose nous fait définir des [schémas](http://mongoosejs.com/docs/guide.html)
// qui représentent la structure, les règles, la validation et les
// extensions de méthodes de nos documents.  C’est extrêmement utile, et
// les possibilités sont particulièrement riches.
var commentSchema = mongoose.Schema({
  // « Clé étrangère » (voyez l’attribut `ref` qui reprend le nom du modèle associé)
  // pour l’auteur.  Comme les clés primaires pour `User` sont des `String` et non des
  // `ObjectID`, on suit le mouvement ici.
  author:   { type: String, ref: 'User', required: true },

  // Date d’envoi, avec une fonction pour fournir une valeur par défaut si besoin.
  // Remarquez qu’on *référence* `Date.now` mais qu’on ne l’appelle pas.  Et Mongoose
  // est assez malin pour appeler `new Date` automatiquement sur le résultat de l'appel
  // le moment venu (`Date.now` renvoie un `Number`).  Notez aussi qu'on en fait un index
  // (c'est pas parce qu'on est en NoSQL qu'on n'a pas d'indexes pour optimiser les perfs)
  // vu qu'on sait pertinemment qu'on va toujours trier.
  postedAt: { type: Date, default: Date.now, index: true },

  // Le texte du commentaire.  Remarquez les petits plus de confort de Mongoose, genre
  // l’attribut `trim`, qui va auto-*trimmer* notre texte (et ne pas planter si celui-ci
  // est à la base `undefined` ou `null`) *avant* de vérifier sa présence au titre de la
  // contrainte `required`.
  text:     { type: String, trim: true, required: true }
});

// Méthodes statiques custom
// -------------------------
//
// Tout ajout à la propriété `statics` du schéma équipe les modèles dérivés de ces méthodes
// statiques.  On aurait la même chose en mode instance avec la propriété `methods` du schéma.
_.extend(commentSchema.statics, {
  // `getAll`, utilisé par `listComments` dans le [contrôleur des commentaires](../controllers/comments.js),
  // est juste une surcouche légère du `find()` de Mongoose (ici sans critères) qui prend juste
  // soin de pré-remplir (*eager loading*) les auteurs et de trier le plus récent d'abord.

  // En terminant par `.exec()`, on termine la chaîne de requêtage/affinage pour produire une
  // [promesse](http://www.html5rocks.com/fr/tutorials/es6/promises/) associée, ce qui rend le
  // code appelant plus confortable à écrire.
  getAll: function getAllComments() {
    return this.find().populate('author').sort({ postedAt: -1 }).exec();
  }
});

// Export du modèle
// ----------------

// Chaque module de modèle publie un modèle Mongoose basé sur le schéma ainsi défini.
// Pour en savoir plus sur la distinction entre schéma et modèle dans Mongoose,
// [jetez un œil par ici](http://mongoosejs.com/docs/models.html).
module.exports = mongoose.model('Comment', commentSchema);
