/**
 * Created by kersal_e on 16/06/2016.
 */

var mysql = require("mysql");
var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var randomstring = require('randomstring');
var config = require('config');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
      "host"  : process.env.mailHost || "ssl0.ovh.net", // hostname
      "secure": true,
      "port"  : process.env.mailPort || 465, // port for secure SMTP
      "auth"  : {
          "user"  : process.env.mailUser,
          "pass"  : process.env.mailPassword
}}));
var jwt = require('jsonwebtoken');

/**
 * @api {get} / Réponse basique
 * @apiVersion 1.0.0
 * @apiName Réponse basique
 * @apiGroup Autres
 * @apiDescription Réponse basique de l'API. Utilisée principalement lors des test de connexion.
 *
 * @apiSuccess (Succès) {String} Message Message basique de bienvenue de la part de l'API
 * @apiSuccess (Succès) {Number} Code Code d'erreur (retourne 1 si aucune erreur n'est détectée)
 *
 * @apiSuccessExample Succès - Réponse:
 *     {
  *       "Message": "Bienvenue sur l'API BeaVR",
  *       "Code" : 1
  *     }
 */
router.get("/", function(req, res){
    res.json({
        "Message" : "Bienvenue sur l'API BeaVR.",
        "Code" : 1
    });
});

/**
 * @api {post} /registration Inscription
 * @apiVersion 1.0.0
 * @apiName Inscription
 * @apiGroup Autres
 * @apiDescription Permet l'inscription d'un nouvel utilisateur.
 *
 * @apiParam {String} email Adresse mail de l'utilisateur
 * @apiParam {String} pseudo Pseudonyme de l'utilisateur
 * @apiParam {String} password Mot de passe de l'utilisateur
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
  *       "Error": false,
  *       "Code" : 1
  *     }
 *
 * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
 * @apiError (Erreur) {Number} Code Code d'erreur (100 = Un des champs est mal renseigné, 101 = L'utilisateur existe déja, 104 = Le pseudonyme est déjà utilisé)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
  *       "Error" : true,
  *       "Code" : 100
  *     }
 *
 */
router.post("/registration", function(req,res){

    var query = "INSERT INTO ?? (`pseudo`, `email`, `password`, `role`) VALUES (?, ?, ?, 4)";
    var table = ["Users", req.body.pseudo, req.body.email, sha1(req.body.password)];

    query = mysql.format(query,table);

    req.app.locals.connection.query(query, function(err,rows){
        if (!err)
            res.json({"Error" : false, "Code" : 1}); // OK
        else
        {
            if (err.code == "ER_DUP_ENTRY")
            {
                var pattern = ".*Duplicate entry '.*' for key '(.*)'";
                var matches = err.message.match(pattern);

                if (matches != null)
                {
                    if (matches[1] == "pseudo")
                        res.json({"Error" : true, "Code" : 104}); // Le pseudo est déjà utilisé
                    if (matches[1] == "email")
                        res.json({"Error" : true, "Code" : 101}); // L'email est déjà utilisé
                }
            }
            else
                res.json({"Error" : true, "Code" : 100}); // Un des champs est mal renseigné
        }
    });
});

/**
 * @api {post} /connection Connexion
 * @apiVersion 1.0.0
 * @apiName Connexion
 * @apiGroup Autres
 * @apiDescription Permet la connexion d'un utilisateur.
 *
 * @apiParam {String} email Adresse mail de l'utilisateur
 * @apiParam {String} password Mot de passe de l'utilisateur
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object} Token Informations de l'utilisateur encrypté en HS256 (HMAC avec SHA-256)
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
  *       "Error": false,
  *       "Code" : 1,
  *       "Data" : {
  *         "idUser": 1,
  *         "email": "j.dujardin@gmail.com",
  *         "password": "a94a8fe5ccb19ba61c4c0873d391e9879ffa353a",
  *         "pseudo" : "JeanJean",
  *         "lastName": "Dujardin",
  *         "firstName": "Jean",
  *         "role": 4,
  *         "registration": "2015-12-05T06:24:33.000Z"
  *       }
  *     }
 *
 * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
 * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'utilisateur n'existe pas, 200 = Mot de passe incorrect)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
 *
 */
router.post("/connection", function(req,res){

    var query = "SELECT * FROM ?? WHERE ?? = ?";
    var table = ["Users", "email", req.body.email];

    query = mysql.format(query, table);

    req.app.locals.connection.query(query, function(err, rows) {
        if (!err)
        {
            if (rows == 0)
                res.json({"Error" : true, "Code" : 103}) // L'utilisateur n'existe pas
            else
            {
                var query = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
                var table = ["Users", "email", req.body.email, "password", sha1(req.body.password)];

                query = mysql.format(query, table);

                req.app.locals.connection.query(query, function(err, rows) {
                    if (!err)
                    {
                        if (rows.length == 0)
                            res.json({"Error" : true, "Code" : 200}); // Mot de passe incorrect
                        else {
                            // L'utilisateur est authentifié
                            var query = "SELECT * FROM ?? WHERE ?? = ?";
                            var table = ["AllUsersInfos", "id", rows[0].idUser];
                            query = mysql.format(query, table);
                            req.app.locals.connection.query(query, function(err, rows) { // Dernière requête pour obtenir les infos importantes de l'user et les set dans le token
                                if (!err) {
                                    var token = jwt.sign(rows[0], process.env.jwtSecretKey);
                                    res.json({"Error" : false, "Code" : 1, "Token" : token}); // OK
                                }
                                else
                                    res.json({"Error" : true, "Code" : 102}); // Erreur
                            })
                        }
                    }
                    else
                        res.json({"Error" : true, "Code" : 102}); // Erreur
                })
            }
        }
        else
            res.json({"Error" : true, "Code" : 102}); // Erreur
    })
});

/**
 * @api {post} /email Vérifier l'existence d'une adresse mail
 * @apiVersion 1.0.0
 * @apiName Vérifier l'existence d'une adresse mail
 * @apiGroup Autres
 * @apiDescription Vérifie si une adresse mail existe bien dans la base de données.
 *
 * @apiParam {String} email Adresse mail de l'utilisateur
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
  *       "Error": false,
  *       "Code" : 1
  *     }
 *
 * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
 * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'adresse mail n'existe pas)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
 *
 */
router.post("/email", function(req,res){

    var query = "SELECT * FROM ?? WHERE ?? = ?";
    var table = ["Users", "email", req.body.email];

    query = mysql.format(query, table);

    req.app.locals.connection.query(query, function(err, rows) {
        if (!err)
        {
            if (rows == 0)
                res.json({"Error" : true, "Code" : 103}) // N'existe pas
            else
                res.json({"Error" : false, "Code" : 1}); // Existe
        }
        else
            res.json({"Error" : true, "Code" : 102});
    })
});

/**
 * @api {post} /reset-password Réinitialiser le mot de passe
 * @apiVersion 1.0.0
 * @apiName Réinitialiser le mot de passe
 * @apiGroup Autres
 * @apiDescription Vérifie si une adresse mail existe bien dans la base de données et réinitialise le mot de passe associé en cas de succès.
 *
 * @apiParam {String} email Adresse mail de l'utilisateur dont le mot de passe associé doit être réinitialisé
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
  *       "Error": false,
  *       "Code" : 1
  *     }
 *
 * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
 * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'adresse mail n'existe pas, 202 = Le mail de réinitialisation n'a pas pu être envoyé)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
 *
 */
router.post("/reset-password", function(req,res){

    var query = "SELECT * FROM ?? WHERE ?? = ?";
    var table = ["Users", "email", req.body.email];

    query = mysql.format(query, table);

    req.app.locals.connection.query(query, function(err, rows) {
        if (err)
            res.json({"Error" : true, "Code" : 102});
        else
        {
            if (rows == 0)
                res.json({"Error" : true, "Code" : 103})
            else
            {
                var query = "UPDATE ?? SET `password`= ? WHERE `email` = ?";
                var password = randomstring.generate(8);
                var table = ["Users", sha1(password), req.body.email];

                query = mysql.format(query, table);
                req.app.locals.connection.query(query, function(err, rows) {
                    if (err)
                        res.json({"Error" : true, "Code" : 102});
                    else
                    {
                        if (rows == 0)
                            res.json({"Error" : true, "Code" : 103});
                        else
                        {
                            var mailOptions = {
                                from: config.get('NodeMailer.resetPasswordMailOptions.senderEmail'),
                                to: req.body.email,
                                subject: config.get('NodeMailer.resetPasswordMailOptions.emailSubject'),
                                text: config.get('NodeMailer.resetPasswordMailOptions.emailBaseText') + password
                            };
                            transporter.sendMail(mailOptions, function(error, info) {
                                if (error) {
                                    res.json({"Error" : true, "Code" : 202})
                                    console.log(error);
                                }
                                else
                                    res.json({"Error" : false, "Code" : 1});
                                console.log(info);
                            })
                            transporter.close();
                        }
                    }
                })
            }
        }
    })
});

/**
 * @api {post} /sendFeedback Effectuer un retour sur le Store
 * @apiVersion 1.0.0
 * @apiName Effectuer un retour sur le Store
 * @apiGroup Autres
 * @apiDescription Permet de transmettre son avis sur le Store, d'effectuer un retour directement aux développeurs.
 *
 * @apiParam {Number} idUser ID de l'utilisateur
 * @apiParam {String} object Sujet du feedback
 * @apiParam {String} description Contenu du feedback
 * @apiParam {Boolean} recontact True si l'utilisateur souhaite être recontacté, False autrement
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
  *       "Error": false,
  *       "Code" : 1
  *     }
 *
 * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
 * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
 *
 */
router.post("/sendFeedback",function(req,res){
    var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
    var table = ["Feedbacks","user","object","description","recontact",req.body.idUser,req.body.object,req.body.description,req.body.recontact];

    query = mysql.format(query,table);
    req.app.locals.connection.query(query,function(err,rows){
        if(err) {
            res.json({"Error" : true, "Code" : 102});
        } else {
            res.json({"Error" : false, "Code" : 1});
        }
    });
});

/**
 * @api {get} /getFeedbacks Récupérer la liste des retours sur le Store
 * @apiVersion 1.0.0
 * @apiName Récupérer la liste des retours sur le Store
 * @apiGroup Autres
 * @apiDescription Permet de récupérer les différents retours sur le Store de la part des utilisateurs.
 *
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object[]} Feedbacks Liste des feedbacks
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
  *       "Error": false,
  *       "Code" : 1,
  *       "Feedbacks": [
  *         {
  *           "idFeedback": 1,
  *           "user": 1,
  *           "object": "Premier feedback",
  *           "description": "Ceci est le premier feedback !",
  *           "recontact": 1
  *         },
  *         ...
  *       ]
  *     }
 *
 * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
 * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
 *
 */
router.get("/getFeedbacks",function(req,res){
    var query = "SELECT * FROM ??";
    var table = ["Feedbacks"];
    query = mysql.format(query,table);
    req.app.locals.connection.query(query,function(err,rows){
        if(err) {
            res.json({"Error" : true, "Code" : 102});
        } else {
            res.json({"Error" : false, "Code" : 1, "Feedbacks" : rows});
        }
    });
});

/**
 * @api {get} /dashboardInfos/:token Récupérer les informations de base du dashboard (doit être administrateur)
 * @apiVersion 1.0.0
 * @apiName Récupérer les informations de base du dashboard
 * @apiGroup Autres
 * @apiDescription Permet de récupérer les informations de base à afficher sur le dashboard (nombre d'utilisateurs, etc.).
 *
 * @apiParam {String} token Token de l'utilisateur connecté
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object[]} DashboardInfos Liste des feedbacks
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
  *       "Error": false,
  *       "Code" : 1,
  *       "DashboardInfos": {
  *           "nbComments": 42,
  *           "nbApplications": 42,
  *           "nbPurchases": 42,
  *           "nbFeedbacks": 42,
  *         }
  *     }
 *
 * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
 * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 105 = L'utilisateur n'a pas les droits, 300 = Token incorrect)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
 *
 */
router.get("/dashboardInfos/:token", function(req, res){
    var decoded = jwt.decode(req.params.token, process.env.jwtSecretKey);
    if (decoded != null) {
        if (decoded.role == 'Administrator') {
            var query = "SELECT * FROM ??";
            var table = ["AllDashboardInfos"];
            query = mysql.format(query,table);
            req.app.locals.connection.query(query,function(err,rows){
                if(err) {
                    res.json({"Error" : true, "Code" : 102});
                } else {
                    res.json({"Error" : false, "Code" : 1, "DashboardInfos" : rows});
                }
            });
        } else {
            res.json({"Error" : true, "Code" : 105}); // L'utilisateur n'a pas les droits
        }
    }
    else {
      res.json({"Error" : true, "Code" : 300}); // Token incorrect
    }
})

module.exports = router;
