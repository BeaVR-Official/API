define({ "api": [
  {
    "type": "post",
    "url": "/connection",
    "title": "Connexion",
    "version": "2.0.0",
    "name": "Connexion",
    "group": "Autres",
    "description": "<p>Permet la connexion d'un utilisateur.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Adresse mail de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Mot de passe de l'utilisateur</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object",
            "optional": false,
            "field": "Token",
            "description": "<p>Informations de l'utilisateur encrypté en HS256 (HMAC avec SHA-256)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 103 = L'utilisateur n'existe pas, 200 = Mot de passe incorrect)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/routes.js",
    "groupTitle": "Autres"
  },
  {
    "type": "post",
    "url": "/connection",
    "title": "Connexion",
    "version": "1.0.0",
    "name": "Connexion",
    "group": "Autres",
    "description": "<p>Permet la connexion d'un utilisateur.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Adresse mail de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Mot de passe de l'utilisateur</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object",
            "optional": false,
            "field": "Token",
            "description": "<p>Informations de l'utilisateur encrypté en HS256 (HMAC avec SHA-256)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Data\" : {\n    \"idUser\": 1,\n    \"email\": \"j.dujardin@gmail.com\",\n    \"password\": \"a94a8fe5ccb19ba61c4c0873d391e9879ffa353a\",\n    \"pseudo\" : \"JeanJean\",\n    \"lastName\": \"Dujardin\",\n    \"firstName\": \"Jean\",\n    \"role\": 4,\n    \"registration\": \"2015-12-05T06:24:33.000Z\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 103 = L'utilisateur n'existe pas, 200 = Mot de passe incorrect)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./_apidoc.js",
    "groupTitle": "Autres"
  },
  {
    "type": "post",
    "url": "/sendFeedback",
    "title": "Effectuer un retour sur le Store",
    "version": "1.0.0",
    "name": "Effectuer_un_retour_sur_le_Store",
    "group": "Autres",
    "description": "<p>Permet de transmettre son avis sur le Store, d'effectuer un retour directement aux développeurs.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idUser",
            "description": "<p>ID de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "object",
            "description": "<p>Sujet du feedback</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Contenu du feedback</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "recontact",
            "description": "<p>True si l'utilisateur souhaite être recontacté, False autrement</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/routes.js",
    "groupTitle": "Autres"
  },
  {
    "type": "post",
    "url": "/registration",
    "title": "Inscription",
    "version": "1.0.0",
    "name": "Inscription",
    "group": "Autres",
    "description": "<p>Permet l'inscription d'un nouvel utilisateur.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Adresse mail de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pseudo",
            "description": "<p>Pseudonyme de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Mot de passe de l'utilisateur</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (100 = Un des champs est mal renseigné, 101 = L'utilisateur existe déja, 104 = Le pseudonyme est déjà utilisé)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 100\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/routes.js",
    "groupTitle": "Autres"
  },
  {
    "type": "get",
    "url": "/getFeedbacks",
    "title": "Récupérer la liste des retours sur le Store",
    "version": "1.0.0",
    "name": "R_cup_rer_la_liste_des_retours_sur_le_Store",
    "group": "Autres",
    "description": "<p>Permet de récupérer les différents retours sur le Store de la part des utilisateurs.</p>",
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object[]",
            "optional": false,
            "field": "Feedbacks",
            "description": "<p>Liste des feedbacks</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Feedbacks\": [\n    {\n      \"idFeedback\": 1,\n      \"user\": 1,\n      \"object\": \"Premier feedback\",\n      \"description\": \"Ceci est le premier feedback !\",\n      \"recontact\": 1\n    },\n    ...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/routes.js",
    "groupTitle": "Autres"
  },
  {
    "type": "get",
    "url": "/dashboardInfos/",
    "title": "Récupérer les informations de base du dashboard (doit être administrateur)",
    "version": "1.0.0",
    "name": "R_cup_rer_les_informations_de_base_du_dashboard",
    "group": "Autres",
    "description": "<p>Permet de récupérer les informations de base à afficher sur le dashboard (nombre d'utilisateurs, etc.).</p>",
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object",
            "optional": false,
            "field": "DashboardInfos",
            "description": "<p>Liste des feedbacks</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"DashboardInfos\": {\n      \"nbComments\": 42,\n      \"nbApplications\": 42,\n      \"nbPurchases\": 42,\n      \"nbFeedbacks\": 42\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 105 = L'utilisateur n'a pas les droits)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/routes.js",
    "groupTitle": "Autres"
  },
  {
    "type": "post",
    "url": "/reset-password",
    "title": "Réinitialiser le mot de passe",
    "version": "1.0.0",
    "name": "R_initialiser_le_mot_de_passe",
    "group": "Autres",
    "description": "<p>Vérifie si une adresse mail existe bien dans la base de données et réinitialise le mot de passe associé en cas de succès.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Adresse mail de l'utilisateur dont le mot de passe associé doit être réinitialisé</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 103 = L'adresse mail n'existe pas, 202 = Le mail de réinitialisation n'a pas pu être envoyé)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/routes.js",
    "groupTitle": "Autres"
  },
  {
    "type": "get",
    "url": "/",
    "title": "Réponse basique",
    "version": "1.0.0",
    "name": "R_ponse_basique",
    "group": "Autres",
    "description": "<p>Réponse basique de l'API. Utilisée principalement lors des test de connexion.</p>",
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>Message basique de bienvenue de la part de l'API</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (retourne 1 si aucune erreur n'est détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse:",
          "content": "{\n  \"Message\": \"Bienvenue sur l'API BeaVR\",\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/routes.js",
    "groupTitle": "Autres"
  },
  {
    "type": "post",
    "url": "/email",
    "title": "Vérifier l'existence d'une adresse mail",
    "version": "1.0.0",
    "name": "V_rifier_l_existence_d_une_adresse_mail",
    "group": "Autres",
    "description": "<p>Vérifie si une adresse mail existe bien dans la base de données.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Adresse mail de l'utilisateur</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 103 = L'adresse mail n'existe pas)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/routes.js",
    "groupTitle": "Autres"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./Documentation/main.js",
    "group": "C__wamp_www_API_Documentation_main_js",
    "groupTitle": "C__wamp_www_API_Documentation_main_js",
    "name": ""
  },
  {
    "type": "post",
    "url": "/applications/",
    "title": "Ajouter une application",
    "version": "1.0.0",
    "name": "Ajout_d_une_application",
    "group": "Gestion_Applications",
    "description": "<p>Ajouter une application.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Nom de l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description de l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "creationdate",
            "description": "<p>Date de création de l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "price",
            "description": "<p>Prix de l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "creator",
            "description": "<p>ID de l'auteur de l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>Lien vers l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "state",
            "description": "<p>Statut de l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "logo",
            "description": "<p>ID du logo de l'application</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 103 = L'application n'existe pas)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/applications/applications.js",
    "groupTitle": "Gestion_Applications"
  },
  {
    "type": "get",
    "url": "/applications/:idApplication",
    "title": "Récupérer les informations d'une application",
    "version": "1.0.0",
    "name": "Informations_d_une_application",
    "group": "Gestion_Applications",
    "description": "<p>Retourne les informations d'une application donnée.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idApplication",
            "description": "<p>ID de l'application</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object",
            "optional": false,
            "field": "Applications",
            "description": "<p>Informations de l'application</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Applications\" : {\n      \"name\": \"Application\",\n      \"description\": \"Ceci est la description de l'application\",\n      \"creationDate\": \"2016-01-31T15:00:00.000Z\",\n      \"price\": 29.99,\n      \"logo\": \"Url du logo\",\n      \"url\": \"Lien vers l'application\",\n      \"categoriesNames\": \"Mathématique, Astrologie\",\n      \"devicesNames\": \"Leap Motion\",\n      \"authorName\": \"Jean Dujardin\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 103 = L'application n'existe pas)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/applications/applications.js",
    "groupTitle": "Gestion_Applications"
  },
  {
    "type": "get",
    "url": "/applications/categories/",
    "title": "Liste des catégories",
    "version": "1.0.0",
    "name": "Liste_des_applications",
    "group": "Gestion_Applications",
    "description": "<p>Retourne la liste de toutes les catégories d'application.</p>",
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object[]",
            "optional": false,
            "field": "States",
            "description": "<p>Liste des catégories</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"States\" : [\n    {\n      \"idCategory\": \"1\",\n      \"name\": \"Mathématique\",\n      \"description\": \"Les chiffres vous parlent ?\",\n        type: 2\n    },\n    ...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/applications/applications.js",
    "groupTitle": "Gestion_Applications"
  },
  {
    "type": "get",
    "url": "/applications/devices/",
    "title": "Liste des devices",
    "version": "1.0.0",
    "name": "Liste_des_applications",
    "group": "Gestion_Applications",
    "description": "<p>Retourne la liste de toutes les devices d'application.</p>",
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object[]",
            "optional": false,
            "field": "Devices",
            "description": "<p>Liste des devices</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"States\" : [\n    {\n      \"idDevice\": \"1\",\n      \"name\": \"LeapMotion\",\n      \"image\": \"masuperleap.jpg\"\n    },\n    ...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/applications/applications.js",
    "groupTitle": "Gestion_Applications"
  },
  {
    "type": "get",
    "url": "/applications/state/:state",
    "title": "Liste des application pour un état donné",
    "version": "1.0.0",
    "name": "Liste_des_applications",
    "group": "Gestion_Applications",
    "description": "<p>Retourne la liste de toutes les applications pour un état donné</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "state",
            "description": "<p>Etat de l'application</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object[]",
            "optional": false,
            "field": "Devices",
            "description": "<p>Liste des devices</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"States\" : [\n    {\n      \"idDevice\": \"1\",\n      \"name\": \"LeapMotion\",\n      \"image\": \"masuperleap.jpg\"\n    },\n    ...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/applications/applications.js",
    "groupTitle": "Gestion_Applications"
  },
  {
    "type": "get",
    "url": "/applications/",
    "title": "Liste des applications",
    "version": "1.0.0",
    "name": "Liste_des_applications",
    "group": "Gestion_Applications",
    "description": "<p>Retourne la liste de toutes les applications.</p>",
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object[]",
            "optional": false,
            "field": "Applications",
            "description": "<p>Liste des applications</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Applications\" : [\n    {\n      \"name\": \"Application\",\n      \"description\": \"Ceci est la description de l'application\",\n      \"creationDate\": \"2016-01-31T15:00:00.000Z\",\n      \"price\": 29.99,\n      \"logo\": \"Url du logo\",\n      \"url\": \"Lien vers l'application\",\n      \"categoriesNames\": \"Mathématique, Astrologie\",\n      \"devicesNames\": \"Leap Motion\",\n      \"authorName\": \"Jean Dujardin\"\n    },\n    ...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/applications/applications.js",
    "groupTitle": "Gestion_Applications"
  },
  {
    "type": "get",
    "url": "/applications/states/",
    "title": "Liste des états",
    "version": "1.0.0",
    "name": "Liste_des_applications",
    "group": "Gestion_Applications",
    "description": "<p>Retourne la liste de toutes les états d'application.</p>",
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object[]",
            "optional": false,
            "field": "States",
            "description": "<p>Liste des états</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"States\" : [\n    {\n      \"id\": \"1\",\n      \"state\": \"Validée\",\n    },\n    ...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/applications/applications.js",
    "groupTitle": "Gestion_Applications"
  },
  {
    "type": "put",
    "url": "/applications/:idApplication/progressions",
    "title": "Mettre à jour la progression d'une application",
    "version": "1.0.0",
    "name": "Mettre___jour_la_progression",
    "group": "Gestion_Applications",
    "description": "<p>Permet de mettre à jour la progression d'un utilisateur sur une application.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "hashProgression",
            "description": "<p>Progression de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idApplication",
            "description": "<p>ID de l'application</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object",
            "optional": false,
            "field": "Applications",
            "description": "<p>Informations de l'application</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/applications/applications.js",
    "groupTitle": "Gestion_Applications"
  },
  {
    "type": "put",
    "url": "/applications/:idApplication",
    "title": "Modifier les informations d'une application",
    "version": "1.0.0",
    "name": "Modifier_les_informations_d_une_application",
    "group": "Gestion_Applications",
    "description": "<p>Modifier les informations d'une application.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Nom de l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description de l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "price",
            "description": "<p>Prix de l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "headdevice",
            "description": "<p>ID du casque de réalité virtuelle</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "handsdevice",
            "description": "<p>ID des gants de réalité virtuelle</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "category",
            "description": "<p>Catégorie dans laquelle est classée l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idApp",
            "description": "<p>ID de l'application</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/applications/applications.js",
    "groupTitle": "Gestion_Applications"
  },
  {
    "type": "get",
    "url": "/applications/:idApplication/progressions",
    "title": "Récupérer la progression",
    "version": "1.0.0",
    "name": "R_cup_rer_la_progression",
    "group": "Gestion_Applications",
    "description": "<p>Récupérer la progression d'un utilisateur sur une application.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idApplication",
            "description": "<p>ID de l'application</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n  \"Progression\" : {\n    \"idApplication\" : 1,\n    \"hashProgression\" : \"jDSNCbaKGyEMFORIarCe80lI3lzt9e9zizppM3WoGgP6uywBIp\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 201 = Aucune progression)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/applications/applications.js",
    "groupTitle": "Gestion_Applications"
  },
  {
    "type": "post",
    "url": "/applications/",
    "title": "Soumettre une application",
    "version": "1.0.0",
    "name": "Soumettre_une_application",
    "group": "Gestion_Applications",
    "description": "<p>Soumettre une application</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Nom de l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description de l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "creationdate",
            "description": "<p>Date de création</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "price",
            "description": "<p>Prix de l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "headdevice",
            "description": "<p>ID du casque de réalité virtuelle</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "handsdevice",
            "description": "<p>ID des gants de réalité virtuelle</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "authord",
            "description": "<p>ID de l'auteur de l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "category",
            "description": "<p>Catégorie dans laquelle est classée l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "appUrl",
            "description": "<p>URL de l'application</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/applications/applications.js",
    "groupTitle": "Gestion_Applications"
  },
  {
    "type": "delete",
    "url": "/applications/:idApplication",
    "title": "Supprimer une application",
    "version": "1.0.0",
    "name": "Suppression_d_une_application",
    "group": "Gestion_Applications",
    "description": "<p>Supprimer une application.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idApplication",
            "description": "<p>ID de l'application</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 103 = L'application n'existe pas)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/applications/applications.js",
    "groupTitle": "Gestion_Applications"
  },
  {
    "type": "put",
    "url": "/applications/:idApplication/validateApplicationSubmission",
    "title": "Valide une application soumise par un développeur",
    "version": "1.0.0",
    "name": "Valide_une_application_soumise_par_un_d_veloppeur",
    "group": "Gestion_Applications",
    "description": "<p>Valide une application soumise par un développeur.</p>",
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/applications/applications.js",
    "groupTitle": "Gestion_Applications"
  },
  {
    "type": "post",
    "url": "/categories/categoryTypes",
    "title": "Ajouter un thème",
    "version": "1.0.0",
    "name": "Ajouter_un_th_me",
    "group": "Gestion_Categories",
    "description": "<p>Ajouter un thème.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Nom du thème</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/categories/categories.js",
    "groupTitle": "Gestion_Categories"
  },
  {
    "type": "get",
    "url": "/categories/",
    "title": "Liste des catégories",
    "version": "1.0.0",
    "name": "Liste_des_cat_gories",
    "group": "Gestion_Categories",
    "description": "<p>Retourne la liste de toutes les catégories.</p>",
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object[]",
            "optional": false,
            "field": "Categories",
            "description": "<p>Liste des catégories</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Categories\": [\n    {\n      \"idCategorie\": 1,\n      \"name\": \"Mathématique\",\n      \"description\": \"Les chiffres vous parlent ? \",\n      \"type\": 2\n    },\n    {\n      \"idCategorie\": 2,\n      \"name\": \"Géologie\",\n      \"description\": \"Les pierres ça vous dit \",\n      \"type\": 2\n    },\n    ...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/categories/categories.js",
    "groupTitle": "Gestion_Categories"
  },
  {
    "type": "get",
    "url": "/categories/categoryTypes/",
    "title": "Liste des thèmes",
    "version": "1.0.0",
    "name": "Liste_des_th_mes",
    "group": "Gestion_Categories",
    "description": "<p>Retourne la liste de tous les thèmes.</p>",
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object[]",
            "optional": false,
            "field": "Categories",
            "description": "<p>Liste des thèmes</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Categories\": [\n     {\n      \"idCategoryType\": 1,\n      \"description\": \"Sport\"\n     },\n     {\n       \"idCategoryType\": 2,\n       \"description\": \"Sciences\"\n     },\n    ...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/categories/categories.js",
    "groupTitle": "Gestion_Categories"
  },
  {
    "type": "get",
    "url": "/categories/:idType",
    "title": "Récupérer les catégories d'un thème",
    "version": "1.0.0",
    "name": "R_cup_rer_les_cat_gories_d_un_th_me",
    "group": "Gestion_Categories",
    "description": "<p>Retourne la liste de toutes les catégories pour un thème donné.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "type",
            "description": "<p>ID du thème</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object[]",
            "optional": false,
            "field": "Categories",
            "description": "<p>Liste des catégories</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Categories\": [\n    {\n      \"idCategorie\": 1,\n      \"name\": \"Mathématique\",\n      \"description\": \"Les chiffres vous parlent ? \",\n      \"type\": 2\n    },\n    {\n      \"idCategorie\": 2,\n      \"name\": \"Géologie\",\n      \"description\": \"Les pierres ça vous dit \",\n      \"type\": 2\n    },\n    ...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 103 = Le thème n'existe pas)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/categories/categories.js",
    "groupTitle": "Gestion_Categories"
  },
  {
    "type": "get",
    "url": "/categories/categoriesAndDevices",
    "title": "Récupérer les thèmes et les devices",
    "version": "1.0.0",
    "name": "R_cup_rer_les_th_mes_et_les_devices",
    "group": "Gestion_Categories",
    "description": "<p>Retourne la liste de tout les thèmes et de tout les devices.</p>",
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object",
            "optional": false,
            "field": "Categories",
            "description": "<p>Liste des thèmes et des devices</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"CategoryTypesAndDevices\": {\n        \"CategoryTypes\": \"Toutes, Sciences, Sports, Mécanique\",\n        \"Devices\": \"Leap Motion, Oculus Rift, HTC Vive, Samsung VR, HoloLens, Project Morpheus\"\n   }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/categories/categories.js",
    "groupTitle": "Gestion_Categories"
  },
  {
    "type": "get",
    "url": "/comments/",
    "title": "Liste des commentaires",
    "version": "1.0.0",
    "name": "Liste_des_commentaires",
    "group": "Gestion_Commentaires",
    "description": "<p>Retourne la liste de toutes les commentaires.</p>",
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object[]",
            "optional": false,
            "field": "Comments",
            "description": "<p>Liste des commentaires</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Comments\" : [\n    {\n      \"id\": 1,\n      \"comment\": \"lorem impsu\",\n      \"rating\": \"5\",\n      \"author\": Jean Dujardin,\n      \"application\": \"1\",\n      \"applicationName\" : \"Superbe app\"\n      \"date\": \"2016-04-15 03:48:32\",\n      \"title\": \"j'adore\",\n      \"pseudo\": \"JeanDu\",\n      \"email\": \"jeandujardin@gmail.com\"\n    },\n    ...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/comments/comments.js",
    "groupTitle": "Gestion_Commentaires"
  },
  {
    "type": "get",
    "url": "/comments/:idApp/:limit",
    "title": "Liste des commentaires d'une application",
    "version": "1.0.0",
    "name": "Liste_des_commentaires_d_une_application",
    "group": "Gestion_Commentaires",
    "description": "<p>Récupérer la liste des commentaires d'une application donnée avec une limite.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idApp",
            "description": "<p>ID de l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>Limite au nombre de commentaires retournés</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object[]",
            "optional": false,
            "field": "Comments",
            "description": "<p>Liste des commentaires</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Comments\" : [\n    {\n      \"idComment\": 1,\n      \"comment\": \"Ceci est un commentaire\",\n      \"rating\": 5,\n      \"author\": 1,\n      \"picture_profile\": \"Lien vers la photo de profil\",\n      \"application\": 1,\n      \"date\": \"2016-04-14T18:51:57.000Z\",\n      \"title\": \"Titre\"\n    },\n    ...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/comments/comments.js",
    "groupTitle": "Gestion_Commentaires"
  },
  {
    "type": "get",
    "url": "/comments/:idApp",
    "title": "Liste des commentaires d'une application",
    "version": "1.0.0",
    "name": "Liste_des_commentaires_d_une_application",
    "group": "Gestion_Commentaires",
    "description": "<p>Récupérer la liste des commentaires d'une application donnée.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idApp",
            "description": "<p>ID de l'application</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object[]",
            "optional": false,
            "field": "Comments",
            "description": "<p>Liste des commentaires</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Comments\" : [\n    {\n      \"idComment\": 1,\n      \"comment\": \"Ceci est un commentaire\",\n      \"rating\": 5,\n      \"author\": 1,\n      \"picture_profile\": \"Lien vers la photo de profil\",\n      \"application\": 1,\n      \"date\": \"2016-04-14T18:51:57.000Z\",\n      \"title\": \"Titre\"\n    },\n    ...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/comments/comments.js",
    "groupTitle": "Gestion_Commentaires"
  },
  {
    "type": "put",
    "url": "/comments/:idComment",
    "title": "Modifier un commentaire",
    "version": "1.0.0",
    "name": "Modifier_un_commentaire",
    "group": "Gestion_Commentaires",
    "description": "<p>Modifier un commentaire sur une application.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "comment",
            "description": "<p>Commentaire de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "rating",
            "description": "<p>Note donnée par l'utilisateur à l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "application",
            "description": "<p>ID de l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Titre du commentaire</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 103 = L'adresse mail n'existe pas, 202 = Le mail de réinitialisation n'a pas pu être envoyé)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/comments/comments.js",
    "groupTitle": "Gestion_Commentaires"
  },
  {
    "type": "post",
    "url": "/comments/:idApp",
    "title": "Publier un commentaire",
    "version": "1.0.0",
    "name": "Publier_un_commentaire",
    "group": "Gestion_Commentaires",
    "description": "<p>Poste un commentaire sur une application.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "comment",
            "description": "<p>Commentaire de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "rating",
            "description": "<p>Note donnée par l'utilisateur à l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "author",
            "description": "<p>ID de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "application",
            "description": "<p>ID de l'application</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Titre du commentaire</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 103 = L'adresse mail n'existe pas, 202 = Le mail de réinitialisation n'a pas pu être envoyé)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/comments/comments.js",
    "groupTitle": "Gestion_Commentaires"
  },
  {
    "type": "delete",
    "url": "/comment/:idApp/:idComment",
    "title": "Supprimer un commentaire",
    "version": "1.0.0",
    "name": "Supprimer_un_commentaire",
    "group": "Gestion_Commentaires",
    "description": "<p>Supprimer un commentaire.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idComment",
            "description": "<p>ID du commentaire</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/comments/comments.js",
    "groupTitle": "Gestion_Commentaires"
  },
  {
    "type": "post",
    "url": "/devices",
    "title": "Ajouter un device",
    "version": "1.0.0",
    "name": "Ajouter_un_device",
    "group": "Gestion_Devices",
    "description": "<p>Ajouter un device.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "name",
            "description": "<p>Nom du device</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "image",
            "description": "<p>URL de l'image du device</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/devices/devices.js",
    "groupTitle": "Gestion_Devices"
  },
  {
    "type": "get",
    "url": "/devices/",
    "title": "Liste des devices",
    "version": "1.0.0",
    "name": "Liste_des_devices",
    "group": "Gestion_Devices",
    "description": "<p>Retourne la liste de tous les devices (casques et gants de réalité virtuelle).</p>",
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object[]",
            "optional": false,
            "field": "Devices",
            "description": "<p>Liste des devices</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Devices\": [\n    {\n      \"idDevice\": 1,\n      \"name\": \"Leap Motion\",\n      \"image\": \"Lien vers l'image\"\n    },\n    {\n      \"idDevice\": 2,\n      \"name\": \"Oculus Rift\",\n      \"image\": \"Lien vers l'image\"\n    },\n    ...\n ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/devices/devices.js",
    "groupTitle": "Gestion_Devices"
  },
  {
    "type": "put",
    "url": "/devices/:idDevice",
    "title": "Mettre à jour un device",
    "version": "1.0.0",
    "name": "Mettre___jour_un_device",
    "group": "Gestion_Devices",
    "description": "<p>Permet de mettre à jour un device.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Nom du device</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "image",
            "description": "<p>Lien vers l'image</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idDevice",
            "description": "<p>ID du device</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/devices/devices.js",
    "groupTitle": "Gestion_Devices"
  },
  {
    "type": "get",
    "url": "/devices/:idDevice",
    "title": "Récupérer les informations d'un device",
    "version": "1.0.0",
    "name": "R_cup_rer_les_informations_d_un_device_donn_",
    "group": "Gestion_Devices",
    "description": "<p>Retourne les informations d'un device (casque ou gants de réalité virtuelle).</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idDevice",
            "description": "<p>ID du device</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object",
            "optional": false,
            "field": "Devices",
            "description": "<p>Informations du device</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Devices\": {\n      \"idDevices\": 1,\n      \"name\": \"Leap Motion\",\n      \"image\": \"Lien vers l'image\"\n    },\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/devices/devices.js",
    "groupTitle": "Gestion_Devices"
  },
  {
    "type": "delete",
    "url": "/devices/:idDevice",
    "title": "Supprimer un device",
    "version": "1.0.0",
    "name": "Suppression_d_un_device",
    "group": "Gestion_Devices",
    "description": "<p>Supprimer un device.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idDevice",
            "description": "<p>ID du device</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 103 = Le device n'existe pas)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/devices/devices.js",
    "groupTitle": "Gestion_Devices"
  },
  {
    "type": "get",
    "url": "/users/:idUser",
    "title": "Récupérer les informations d'un utilisateur",
    "version": "1.0.0",
    "name": "Informations_d_un_utilisateur",
    "group": "Gestion_Utilisateurs",
    "description": "<p>Retourne les informations d'un utilisateur donné.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idUser",
            "description": "<p>ID de l'utilisateur souhaité</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object",
            "optional": false,
            "field": "Users",
            "description": "<p>Informations de l'utilisateur</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Users\" : {\n      \"idUser\": 1,\n      \"email\": \"j.dujardin@gmail.com\",\n      \"pseudo\": \"JeanJean\",\n      \"lastName\": \"Dujardin\",\n      \"firstName\": \"Jean\",\n      \"role\": 4,\n      \"registration\": \"2015-12-05T06:24:33.000Z\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 103 = L'utilisateur n'existe pas, 105 = L'utilisateur n'a pas les droits)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/users/users.js",
    "groupTitle": "Gestion_Utilisateurs"
  },
  {
    "type": "get",
    "url": "/users/applications/",
    "title": "Récupérer les applications d'un utilisateur",
    "version": "1.0.0",
    "name": "Informations_d_un_utilisateur",
    "group": "Gestion_Utilisateurs",
    "description": "<p>Retourne les applications de l'utilisateur possédant le token passé en header.</p>",
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object",
            "optional": false,
            "field": "Users",
            "description": "<p>Applications de l'utilisateur</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Users\" : {\n      \"id\": 1,\n      \"name\": \"Superbe app\",\n      \"description\": \"Description de ma superbe app\",\n      \"buyer\": \"28\",\n      \"retailer\": \"12\",\n      \"logo\": \"http://beavr.fr/media/masuperbeapp.png\",\n      \"url\": \"http://beavr.fr/app/masuperbeapp\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 103 = L'utilisateur n'existe pas)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/users/users.js",
    "groupTitle": "Gestion_Utilisateurs"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Liste des utilisateurs",
    "version": "1.0.0",
    "name": "Liste_des_utilisateurs",
    "group": "Gestion_Utilisateurs",
    "description": "<p>Retourne la liste de tous les utilisateurs.</p>",
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object[]",
            "optional": false,
            "field": "Users",
            "description": "<p>Liste des utilisateurs</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Users\" : [\n    {\n      \"idUser\": 1,\n      \"email\": \"j.dujardin@gmail.com\",\n      \"pseudo\": \"JeanJean\",\n      \"lastName\": \"Dujardin\",\n      \"firstName\": \"Jean\",\n      \"role\": 4,\n      \"registration\": \"2015-12-05T06:24:33.000Z\"\n    },\n    ...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 105 = L'utilisateur n'a pas les droits)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/users/users.js",
    "groupTitle": "Gestion_Utilisateurs"
  },
  {
    "type": "get",
    "url": "/users/roles/",
    "title": "Liste des rôles",
    "version": "1.0.0",
    "name": "Liste_des_utilisateurs",
    "group": "Gestion_Utilisateurs",
    "description": "<p>Retourne la liste de toutes les rôles d'utilisateurs.</p>",
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object[]",
            "optional": false,
            "field": "Roles",
            "description": "<p>Liste des rôles</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Roles\" : [\n    {\n      \"idRole\": \"1\",\n      \"role\": \"Administrator\",\n      \"description\": \"Equipe qui développe le projet\"\n    },\n    ...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/users/users.js",
    "groupTitle": "Gestion_Utilisateurs"
  },
  {
    "type": "put",
    "url": "/users/:idUser",
    "title": "Modifier un utilisateur",
    "version": "2.0.0",
    "name": "Modification_des_informations_d_un_utilisateur",
    "group": "Gestion_Utilisateurs",
    "description": "<p>Modifier les informations d'un utilisateur donné.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Adresse mail de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Mot de passe de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Nom de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstname",
            "description": "<p>Prénom de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "role",
            "description": "<p>Rôle de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "profilePicture",
            "description": "<p>URL vers la photo de profil de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idUser",
            "description": "<p>ID de l'utilisateur souhaité</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object",
            "optional": false,
            "field": "Users",
            "description": "<p>Informations de l'utilisateur</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Users\" : {\n      \"idUser\": 1,\n      \"email\": \"j.dujardin@gmail.com\",\n      \"pseudo\": \"JeanJean\",\n      \"lastName\": \"Dujardin\",\n      \"firstName\": \"Jean\",\n      \"role\": 4,\n      \"profilePicture\": \"http://...\",\n      \"registration\": \"2015-12-05T06:24:33.000Z\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 105 = L'utilisateur n'a pas les droits)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/users/users.js",
    "groupTitle": "Gestion_Utilisateurs"
  },
  {
    "type": "put",
    "url": "/users/:idUser",
    "title": "Modifier un utilisateur",
    "version": "1.0.0",
    "name": "Modification_des_informations_d_un_utilisateur",
    "group": "Gestion_Utilisateurs",
    "description": "<p>Modifier les informations d'un utilisateur donné.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Adresse mail de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Mot de passe de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Nom de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstname",
            "description": "<p>Prénom de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "role",
            "description": "<p>Rôle de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idUser",
            "description": "<p>ID de l'utilisateur souhaité</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          },
          {
            "group": "Succès",
            "type": "Object",
            "optional": false,
            "field": "Users",
            "description": "<p>Informations de l'utilisateur</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1,\n  \"Users\" : {\n      \"idUser\": 1,\n      \"email\": \"j.dujardin@gmail.com\",\n      \"pseudo\": \"JeanJean\",\n      \"lastName\": \"Dujardin\",\n      \"firstName\": \"Jean\",\n      \"role\": 4,\n      \"registration\": \"2015-12-05T06:24:33.000Z\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 105 = L'utilisateur n'a pas les droits)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./_apidoc.js",
    "groupTitle": "Gestion_Utilisateurs"
  },
  {
    "type": "delete",
    "url": "/users/:idUser",
    "title": "Supprimer un utilisateur",
    "version": "1.0.0",
    "name": "Suppression_d_un_utilisateur",
    "group": "Gestion_Utilisateurs",
    "description": "<p>Supprime un utilisateur donné.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idUser",
            "description": "<p>ID de l'utilisateur souhaité</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Succès": [
          {
            "group": "Succès",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;false&quot; en cas de réussite</p>"
          },
          {
            "group": "Succès",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (1 = Aucune erreur détectée)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succès - Réponse :",
          "content": "{\n  \"Error\": false,\n  \"Code\" : 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Erreur": [
          {
            "group": "Erreur",
            "type": "Boolean",
            "optional": false,
            "field": "Error",
            "description": "<p>Retourne &quot;true&quot; en cas d'erreur</p>"
          },
          {
            "group": "Erreur",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<p>Code d'erreur (102 = Erreur lors de la requête, 103 = L'utilisateur n'existe pas, 105 = L'utilisateur n'a pas les droits)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Erreur - Réponse :",
          "content": "{\n  \"Error\" : true,\n  \"Code\" : 102\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/users/users.js",
    "groupTitle": "Gestion_Utilisateurs"
  }
] });
