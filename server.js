'use strict';

require('colors');

var express = require('express');
var http    = require('http');

var app = express();
var server = http.createServer(app);

app.set('port', process.env.PORT || 3000);

require('./controllers/home')(app);

server.listen(app.get('port'), function() {
  console.log('✔︎︎ Express server listening on http://localhost:%d/'.green, app.get('port'));
});
