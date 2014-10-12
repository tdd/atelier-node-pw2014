var os = require('os');
var moment = require('moment');
moment.locale('fr');

var now = moment();
console.log("Salut tout le monde !");
console.log("On est", now.format('dddd D MMMM YYYY à HH[h]mm'));
console.log("Cette machine a", os.cpus().length, "processeurs et",
  os.totalmem() / (1024*1024*1024), "Go de RAM");
