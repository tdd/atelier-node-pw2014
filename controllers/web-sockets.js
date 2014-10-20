// Contrôleur : Web Sockets
// ========================

// Le mode strict c’est le bien…
'use strict';

var io = require('socket.io');

// Singleton
// ---------
//
// Ce module met en place un écouteur Web Sockets (avec toutes les couches
// de *fallback* prévues par [Socket.IO](http://socket.io/),
// ce qui fait que ça marche dès IE5.5) au sein du serveur HTTP brut
// (et non comme un *middleware* de l'appli Express).
//
// Par ailleurs, il publie un singleton `sockets`, qui représente le point
// de *broadcast* sur toutes les Web Sockets (ou équivalences) connectées.
//
// Le [point d’entrée du serveur](../server.html) initialise ce module, et
// le [contrôleur de commentaires](./comments.html) le récupère pour diffuser
// les notifs de nouveaus commentaires.
var singleton = module.exports = function socketsController(server) {
  if (singleton.sockets) {
    return;
  }

  var ws = io.listen(server);
  singleton.sockets = ws.sockets;
};

