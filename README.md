<p align="center">
<img width="300" src="/README/2017_logo_beavr.png">
</p>

# API

# Version <img style="width:10%; text-align:center;" src="https://travis-ci.org/BeaVR-Official/API.svg?branch=master">

`1.0` API fonctionnelle en cours d'amélioration pour stabilité


## Installation

* Clone du dépot
```
  git clone https://github.com/BeaVR-Official/API.git
```

* Installation du gestionnaire de package npm
```
  sudo apt-get install npm
```

* Installation des dépendances
```
  npm install
```

## Configuration
* Garder une copie du dossier permettant de ne pas commit n'importe quoi

* Ajouter les lignes completées suivantes au fichier Server.j:
```bash
process.env.dbConnectionLimit = ;
process.env.dbHost = ;
process.env.dbName = ;
process.env.dbPassword = ;
process.env.dbPort = ;
process.env.dbUsername = ;
process.env.mailHost = ;
process.env.mailPassword = ;
process.env.mailPort = ;
process.env.mailUser = ;
process.env.jwtSecretKey = ;
// Required to get the right configuration file under /config
process.env.NODE_ENV = "debug";
```

* Optionnel / Si vous voulez utiliser votre version locale du Store ou du BO, modifier le fichier app.module.js
```
var url = "http://beavr-api.herokuapp.com";
```
par
```
var url = "http://localhost:3000";
```

## Lancement de l'API

* Exécution de l'API
```
  npm start
```

* Exécution des tests unitaires
```
  npm test
```

## Addresse de déploiement

Travis deploie automatiquement sur Heroku quand la compilation passe.

```sh
  https://beavr-api.herokuapp.com
```
