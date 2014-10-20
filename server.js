// Point d’entrée du serveur
// =========================

// Le mode strict c’est le bien…
'use strict';

// On dope `String` avec des accesseurs de coloration, par exemple `.green`,
// pour avoir de jolis affichages en console…
require('colors');

// J’aime bien coller tous mes `require` (ou presque) en haut, ça permet
// d'avoir une vue claire des dépendances…

var bodyParser    = require('body-parser');
var cookieSession = require('cookie-session');
var csrf          = require('csurf');
var express       = require('express');
var flash         = require('connect-flash');
var http          = require('http');
var morgan        = require('morgan');
var passport      = require('passport');
var path          = require('path');
var serveStatic   = require('serve-static');

// Noyau de l'appli
// ----------------

// 1. On crée une « appli » serveur, grâce à [Express](http://expressjs.com/)
var app = express();
// 2. On crée un serveur HTTP qui lui délègue l'applicatif
var server = http.createServer(app);

// Config de base
// --------------

// Le port d'écoute sera celui défini en environnement ou, à défaut, 3000.
app.set('port', process.env.PORT || 3000);
// Et on utilisera Jade pour le templating (du coup, Express cherchera, pour
// une vue `"comments/new"`, le fichier `views/comments/new.jade`).
app.set('view engine', 'jade');

// Express récupère dans son réglage `'env'` la valeur de la variable d’environnement
// `NODE_ENV`, laquelle est à `'development'` par défaut.
var devMode = 'development' === app.get('env');

// Middlewares
// -----------

// Le module [morgan](https://github.com/expressjs/morgan) gère un log formatable en console.
// Si on voulait du gros log de furieux, on utiliserait [Bunyan](https://github.com/trentm/node-bunyan)
// ou [Winston](https://github.com/flatiron/winston).
app.use(morgan(devMode ? 'dev' : 'common'));

// On maintient nos sessions côté client, dans des cookies signés, grâce à
// [cookie-session](https://github.com/expressjs/cookie-session).  Ici on n’utilise
// pas de clés rotatives, juste une (`secret`).  Si vous préférez persister vos sessions
// côté serveur, jetez un œil à [express-session](https://github.com/expressjs/session)
// par-dessus [connect-redis](https://github.com/visionmedia/connect-redis), par exemple.
app.use(cookieSession({ name: 'node-pw14:session', secret: "Node.js c’est de la balle !" }));

// On n’est intéressés que par les corps de requête de type formulaires simples
// ("URL-encoded"), donc on se limite à cette analyse-là.  C’est
// [body-parser](https://github.com/expressjs/body-parser) qui sait gérer ça.
app.use(bodyParser.urlencoded({ extended: true }));

// On se protège contre les attaques [CSRF](https://fr.wikipedia.org/wiki/Cross-Site_Request_Forgery)
// avec ce brave [csurf](https://github.com/expressjs/csurf).
// On fournira le token à inclure par les formulaires dans un paramètre `_csrf` au travers
// de notre [helper](./helpers/main.html).
app.use(csrf());

// Afin de pouvoir définir et relire des contenus temporaires (au travers d'une redirection,
// notamment), on utilise [connect-flash](https://github.com/jaredhanson/connect-flash),
// qui équipe les requêtes de la méthode `flash(…)`.
app.use(flash());

// Tout fichier statique présent dans le sous-dossier `public/` peut être servi automatiquement,
// avec le bon type MIME et tout…  Merci [serve-static](https://github.com/expressjs/serve-static).
app.use(serveStatic(path.join(__dirname, 'public')));

// Pour l’authentification, on utilise [Passport](http://passportjs.org/).  Celui-ci requiert au
// moins le *middleware* fourni par `passport.initialize()` pour étendre les requêtes avec les
// propriétés (ex. `user`) et méthodes (ex. `isAuthenticated()`) nécessaires, ainsi que, si on
// utilise les sessions pour persister l'authentification, celui fourni par `passport.session()`,
// qui s'occupera de (dé)sérialiser un objet représentant l'utilisateur courant.  Les *hooks* pour
// ce faire seront dans notre [contrôleur utilisateurs](./controllers/users.html).  Il est
// évidemment nécessaire que `req.session` soit déjà mis en place, donc ici que `cookieSession`
// soit enregistré par `app.use(…)` avant `passport.session()`.
app.use(passport.initialize());
app.use(passport.session());

// Variables de vue par défaut
// ---------------------------
//
// Les templates lisent leurs variables depuis trois sources.  Par ordre de priorité croissante,
// ce sont :
//
//   1. `app.locals` (app-wide, généralement défini une bonne fois, comme ici)
//   2. `res.locals` (response-wide, souvent rempli par des middlewares)
//   3. L’objet/hash fourni en 2ème argument à `res.render` (vue seule)
app.locals.title = 'Node.js démystifié';

// La variable `pretty` a un rôle particulier dans [Jade](http://jade-lang.com/) : si elle est
// *truthy* (ex. `true`, `42`, `'yes'`, etc.), elle déclenche un traitement supplémentaire
// d'indentation du HTML produit.  Par défaut, Jade n'injecte aucun *whitespace* et produit un
// HTML minifié, ce qui est top pour la prod, mais pas génial en dev…
app.locals.pretty = devMode;

// Helpers & Contrôleurs
// ---------------------
//
// On déporte les différents « modules » applicatifs dans leurs modules propres, pour conserver
// un code modulaire, plus lisible et plus pratique à maintenir.

require('./helpers/main')(app);
require('./controllers/users')(app);
require('./controllers/home')(app);
require('./controllers/comments')(app);
require('./controllers/web-sockets')(server);

// Démarrage du serveur
// --------------------

// On s’assure que la connexion MongoDB est ouverte…
require('./models/connection')(function() {
  // On le dit… (notez le `.green` fourni par `colors` à la fin)
  console.log('✔︎ Connected to mongoDB database'.green);

  // …et on lance le serveur HTTP sur le port qui va bien.
  // Un simple Ctrl+C (ou signal SIGINT passé autrement) arrêtera tout ça proprement.
  server.listen(app.get('port'), function() {
    console.log('✔︎︎ Express server listening on http://localhost:%d/'.green, app.get('port'));
  });
});
