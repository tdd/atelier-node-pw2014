'use strict';

var io = require('socket.io');

var singleton = module.exports = function socketsController(server) {
  if (singleton.sockets) {
    return;
  }

  var ws = io.listen(server);
  singleton.sockets = ws.sockets;
};
