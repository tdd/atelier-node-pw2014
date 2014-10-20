// Client Web Sockets
// ==================

// Ce micro-module est chargé d'office sur les pages de l'appli,
// et le cas échéant écoutera les notifs Web Sockets du serveur
// pour injecter en temps réel les commentaires d'autres utilisateurs.

// Vous pouvez facilement tester ça en ouvrant deux navigateurs sur
// l'appli, ou en ouvrant une session de navigation privée dans le même
// navigateur (deux sessions distinctes au final, donc ça roule).  En fait
// même deux fenêtres dans la même session marcheraient, mais utiliser deux
// comptes utilisateurs séparés c'est plus marrant :-)

/* global $, io */

(function() {
  // Le mode strict c’est le bien…
  'use strict';

  // C'est le `$` de jQuery : appeler `init()` quand le DOM est prêt.
  $(init);

  var container;

  // Initialisation contextuelle
  // ---------------------------
  function init() {
    container = $('#commentsList');
    // On est sur une page avec la liste des commentaires ?  Écouter les Web Sockets !
    // (pour info, `container` serait un `<tbody>`).
    if (container.length) {
      initSockets();
    }
  }

  // Écouteur Web Sockets
  // --------------------
  function initSockets() {
    // Sans déconner, c'est tout.  Si.  Juré.  Merci [Socket.IO](http://socket.io/) !
    var socket = io.connect();

    // Pour toute notif de commentaire émanant du serveur…
    socket.on('new-comment', function(html) {
      // …incruster ça en haut de la liste…
      container.prepend(html);
      // …et dès que c'est désérialisé dans le DOM, faire un micro-effet à deux balles
      // pour attirer l'attention.
      setTimeout(function() {
        container.find('tr:first').hide().fadeIn();
      }, 0);
    });
  }
})();
