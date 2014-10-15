Node.js démystifié
==================

[![Code Climate](https://codeclimate.com/github/tdd/atelier-node-pw2014/badges/gpa.svg)](https://codeclimate.com/github/tdd/atelier-node-pw2014)
[![Dependency Status](https://gemnasium.com/tdd/atelier-node-pw2014.svg)](https://gemnasium.com/tdd/atelier-node-pw2014)

Un [atelier Paris Web 2014]() pour faire découvrir Node.js à ceux qui n’en ont jamais fait (mais qui ont fait du JavaScript, quand même…), pas à pas, dans la joie et la bonne humeur.

## Public et pré-requis

Cet atelier s'adresse à toute personne curieuse de découvrir Node.js et ayant déjà un minimum de niveau en JavaScript (il n'est pas nécessaire d'être expert).  L'atelier peut être suivi passivement, mais est conçu à la base pour être suivi interactivement sur les laptops des participants.

À ce titre, plusieurs technologies doivent être installées (voir [les slides](http://tdd.github.io/atelier-node-pw2014/) pour les liens utiles) :

  * [Node.js](http://nodejs.org/)
  * [Git](http://git-scm.com/)
  * [mongoDB](http://www.mongodb.org/)

À part ça, un éditeur confortable, une ligne de commande, et hop.

## Installation

Outre les technos ci-dessus, le dépôt de base doit être récupéré.

De préférence avec Git, afin de bénéficier des tags intermédiaires :

    $ git clone https://github.com/tdd/atelier-node-pw2014.git

Sinon en récupérant [une archive de release](https://github.com/tdd/atelier-node-pw2014/releases) et en la décompressant.

## Étapes intermédiaires et tags

Chaque commit du dépôt, au-delà du tag `start`, constitue une étape intermédiaire.  Les participants peuvent ainsi facilement partir d'une étape donnée, ou reprendre à une étape souhaitée, s'ils ont du mal à suivre ou sont moins intéressés par une partie de l'atelier.

Chaque tag constitue le **début** de l'étape qu'il annonce, le commit qui le suit complétant cette étape.  On se cale sur un tag de façon classique, par exemple pour démarrer :

    $ git checkout 00-start

Pour voir tous les tags :

    $ git tag

## Modules utilisés

Cet atelier vise à mettre en avant un certain nombre de modules très répandus.  On y trouve notamment :

  * [express](http://expressjs.com/) pour le framework web de base, et des modules dédiés (middlewares Connect) :
    * [body-parser](https://github.com/expressjs/body-parser) pour l'extraction des paramètres de requête,
    * [connect-flash](https://github.com/jaredhanson/connect-flash) pour les messages et données temporaires jusqu’au prochain rendering,
    * [cookie-session](https://github.com/expressjs/cookie-session) pour la gestion des sessions signées dans les cookies,
    * [csurf](https://github.com/expressjs/csurf) pour la protection contre [CSRF](https://fr.wikipedia.org/wiki/Cross-Site_Request_Forgery),
    * [morgan](https://github.com/expressjs/morgan) pour les logs simples,
    * [serve-static](https://github.com/expressjs/serve-static) pour servir les fichiers statiques.
  * [jade](http://jade-lang.com/) pour le templating,
  * [mongoose](http://mongoosejs.com/) pour la modélisation de documents mongoDB,
  * [passport](http://passportjs.org/) pour les stratégies d'authentification, avec les stratégies retenues :
    * [passport-local](https://github.com/jaredhanson/passport-local) pour les comptes locaux au serveur,
    * [passport-facebook](https://github.com/jaredhanson/passport-facebook) et [passport-twitter](https://github.com/jaredhanson/passport-twitter) pour les authentifications OAuth auprès de ces deux services.
  * [socket.io](http://socket.io/) pour le temps-réel entre le serveur et ses clients,
  * [colors](https://github.com/Marak/colors.js) pour des affichages plus jolis en console,
  * [moment](http://momentjs.com/) pour le formatage des dates et heures,
  * [underscore](http://underscorejs.org/) pour les petits utilitaires algorithmiques pratiques.

## Slides

  * Les [slides de support](http://tdd.github.io/atelier-node-pw2014/) de l’atelier
  * La dernière version avant Paris Web 2014 de ma présentation [Tour d'horizon de Node.js](http://delicious-insights.com/talks/mixit-node/) (fin avril 2014)
  * *The business case for Node*, par Joe McCann, de The Node Source : [slides](http://fr.slideshare.net/joemccann/the-business-case-for-node) et [vidéo](https://www.youtube.com/watch?v=bqLXjNbMZpY) (mars 2014)

## La formation Node.js de JS Attitude

Ma société, Delicious Insights, propose *via* [JS Attitude](http://www.js-attitude.fr/) une excellente [formation Node.js](http://www.js-attitude.fr/node-js/), vous devriez allez jeter un œil si le sujet vous intéresse !

## Paris Web

<a href="http://www.paris-web.fr/"><img src="http://www.paris-web.fr/telechargements/non-date/LOGO-PARISWEB.png" alt="Logo Paris Web" align="left" width="220"></a>

[Paris Web](http://www.paris-web.fr/) est la conférence francophone de référence sur les sujets du web, en particulier du front.  Autour de ses trois piliers clés : **qualité, interopérabilité, accessibilité**, elle décline depuis 2006 de nombreux thèmes tels que le design, l'UX, le mobile, les performances, les enjeux métier, et bien d'autres encore.

Elle se tient généralement à la mi-octobre, à Paris ou en proche banlieue, et accueille environ 600 personnes pour 2 jours de conférences du jeudi au vendredi, ainsi que 250 personnes le samedi pour des ateliers à très faible coût.  Les plus grands noms du web y sont orateurs.

Toutes les conférences sont filmées et les vidéos mises à disposition gratuitement en ligne ([de 2006 à 2012](http://www.dailymotion.com/playlists/user/parisweb/1), [à partir de 2013](http://vimeo.com/parisweb)).  Elles sont également streamées gratuitement en direct.

## License

Ce dépôt est sous license MIT.  Vous pouvez [la consulter ici](https://github.com/tdd/atelier-node-pw2014/blob/master/LICENSE).
