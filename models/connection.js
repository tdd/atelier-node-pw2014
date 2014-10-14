'use strict';

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodepw14');

var db = mongoose.connection;
db.on('error', function() {
  console.error('✘ CANNOT CONNECT TO mongoDB DATABASE nodepw14!'.red);
});

module.exports = function(onceReady) {
  if (onceReady) {
    db.on('open', onceReady);
  }
};
