/* global $, io */

(function() {
  'use strict';

  $(init);

  var container;

  function init() {
    container = $('#commentsList');
    if (container.length) {
      initSockets();
    }
  }

  function initSockets() {
    var socket = io.connect();
    socket.on('new-comment', function(html) {
      container.prepend(html);
      setTimeout(function() {
        container.find('tr:first').hide().fadeIn();
      }, 0);
    });
  }
})();
