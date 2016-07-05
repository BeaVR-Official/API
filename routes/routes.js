/**
 * Created by kersal_e on 16/06/2016.
 */

var mysql = require("mysql");
var express = require('express');
var router = express.Router();
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
var expressjwt = require('express-jwt');
var Users = require('../models/users');
var CryptoJS = require('crypto-js');
var Feedbacks = require("../models/feedback");

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
router.get("/", function(req, res, next){
    try {
        res.status(200).json({
            status : 200,
            message : "Welcome on BeaVR API."
        });
    }  catch (error) {
        return next(error);
    }
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
router.post("/registration", function(req,res, next) {
    if (req.body.pseudo == undefined || req.body.email == undefined || req.body.password == undefined) {
        return next(req.app.getError(404, "One or multiple field incorrect.", {}));
    }
    try {
        var newUser = new Users({
            username : req.body.pseudo,
            password : CryptoJS.SHA256(req.body.password).toString(),
            email : req.body.email,
            admin : false
        });
        newUser.save(function(err) {
            if (err) {
                return next(err);
            }
            res.status(200).json({status : 200, message : "OK", data: null }); // OK
        });
    }  catch (error) {
        return next(error);
    }
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
router.post("/connection", function(req,res, next){
    if (req.body.email == undefined || req.body.password == undefined) {
        return next(req.app.getError(400, "One or multiple field incorrect.", {}));
    }
    try {
        Users.findOne({ 'email': req.body.email, password: CryptoJS.SHA256(req.body.password).toString()}, function(err, user) {
            if (err) return next(err);
            else if (user == null) return next(req.app.getError(401, "Authentication failed.", null));
            else {
                var token = jwt.sign({id : user._id}, process.env.jwtSecretKey);
                res.status(200).json({status : 200, message : "User authenticated.", data: { token: token } });
            }
        });
    } catch (error) {
        return next(error);
    }
    /*  var table = ["Users", "email", req.body.email];

     try {
     query = mysql.format(query, table);

     req.app.locals.connection.query(query, function(err, rows) {
     if (!err)
     {
     if (rows == 0)
     return next(req.app.getError(401, "User doesn't exist.", null)); // <---- Should be modified
     else
     {
     var query = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
     var table = ["Users", "email", req.body.email, "password", sha1(req.body.password)];

     query = mysql.format(query, table);

     req.app.locals.connection.query(query, function(err, rows) {
     if (!err)
     {
     if (rows.length == 0)
     return next(req.app.getError(401, "Bad password.", null));
     else {
     // L'utilisateur est authentifié
     var query = "SELECT * FROM ?? WHERE ?? = ?";
     var table = ["AllUsersInfos", "id", rows[0].idUser];
     query = mysql.format(query, table);
     req.app.locals.connection.query(query, function(err, rows) { // Dernière requête pour obtenir les infos importantes de l'user et les set dans le token
     if (!err) {
     var token = jwt.sign(rows[0], process.env.jwtSecretKey);
     res.status(200).json({status : 200, message : "User authenticated.", data: { token: token } });
     }
     else
     return next(req.app.getError(500, "Error width database", err));
     });
     }
     }
     else
     return next(req.app.getError(500, "Error width database", err));
     });
     }
     }
     else
     return next(req.app.getError(500, "Error width database", err));
     });
     }
     catch (error) {
     return next(error);
     }*/
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
router.post("/email", function(req,res, next){
    return next(req.app.getError(404, "Request deprecated."), null);
    /*    if (req.body.email == undefined) {
     return next(req.app.getError(400, "Bad request, missing required parameter.", null));
     }

     var query = "SELECT * FROM ?? WHERE ?? = ?";
     var table = ["Users", "email", req.body.email];

     try {
     query = mysql.format(query, table);

     req.app.locals.connection.query(query, function(err, rows) {
     if (!err)
     {
     if (rows == 0)
     return next(req.app.getError(404, "Entity not found.", null)); // <---- Should be modified
     else
     res.status(200).json({status : 200, message : "Entity found.", data: { } });
     }
     else
     return next(req.app.getError(500, "Error width database", err));
     });
     }
     catch (error) {
     return next(error);
     }*/
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
router.post("/reset-password", function(req,res, next){

    if (req.body.email == undefined) {
        return next(req.app.getError(400, "Bad request, missing required parameter.", null));
    }
    try {
        User.findOne({email : req.body.email}, function(error, user) {
            if (err) return next(err);
            else if (user == null) return next(req.app.getError(404, "User not found.", null));
            else {
                var password = randomstring.generate(8);
                user.password = CryptoJS.SHA256(password).toString();
                user.save();
                var mailOptions = {
                    from: config.get('NodeMailer.resetPasswordMailOptions.senderEmail'),
                    to: user.email,
                    subject: config.get('NodeMailer.resetPasswordMailOptions.emailSubject'),
                    text: config.get('NodeMailer.resetPasswordMailOptions.emailBaseText') + password
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) return next(req.app.getError(500, "Internal error mail sender.", error));
                    else
                        res.status(200).json({
                            status : 200,
                            message : "Password successfully reset.",
                            data: {
                                info: info
                            }
                        });
                });
                transporter.close();
            }
        })
    }  catch (error) {
        return next(error);
    }
    /*  var query = "SELECT * FROM ?? WHERE ?? = ?";
     var table = ["Users", "email", req.body.email];

     try {
     query = mysql.format(query, table);

     req.app.locals.connection.query(query, function(err, rows) {
     if (err)
     return next(req.app.getError(500, "Internal error width database", err));
     else
     {
     if (rows == 0)
     return next(req.app.getError(404, "Entity not found.", null));
     else
     {
     var query = "UPDATE ?? SET `password`= ? WHERE `email` = ?";
     var password = randomstring.generate(8);
     var table = ["Users", sha1(password), req.body.email];

     query = mysql.format(query, table);
     req.app.locals.connection.query(query, function(err, rows) {
     if (err)
     return next(req.app.getError(500, "Internal error width database", err));
     else
     {
     if (rows == 0)
     return next(req.app.getError(404, "Entity not found.", null));
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
     return next(req.app.getError(500, "Internal error mail sender.", error));
     console.log(error);
     }
     else
     res.status(200).json({status : 200, message : "Password successfully reset.", data: { info: info } });
     });
     transporter.close();
     }
     }
     })
     }
     }
     });
     }
     catch (error) {
     return next(error);
     }*/
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
router.post("/sendFeedback", expressjwt({secret: process.env.jwtSecretKey}),function(req,res, next){
    if (req.user.id == "" || req.user.id == undefined)
        return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
    if (req.body.object == undefined || req.body.description == undefined)
        return next(req.app.getError(400, "Bad request, missing required parameter.", null));

    try {
        var newFeedback = new Feedbacks({
            user        : req.user.id,
            object      : req.body.object,
            description : req.body.description
        });
        newFeedback.save(function(err) {
            if (err) return next(err);
            res.status(200).json({
                status : 200,
                message : "Feedback successfully sent.",
                data: {}
            });
        });
    } catch (error) {
        return next(error);
    }
    /*    var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
     var table = ["Feedbacks","user","object","description","recontact",req.body.idUser,req.body.object,req.body.description,req.body.recontact];

     try {
     query = mysql.format(query,table);
     req.app.locals.connection.query(query,function(err,rows){
     if(err) {
     return next(req.app.getError(500, "Internal error width database", err));
     } else {
     res.status(200).json({status : 200, message : "Feedback successfully sent.", data: {}});
     }
     });
     }
     catch (error) {
     return next(error);
     }*/
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
router.get("/getFeedbacks", expressjwt({secret: process.env.jwtSecretKey}), function(req,res, next){
    if (req.user.id == "" || req.user.id == undefined)
        return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
    try {
        User.findOne({_id: req.user.id, admin: true}, function (err, user) {
            if (err) return next(err);
            else if (user == null) return next(req.app.getError(403, "Forbidden : user needs admin privileges.", null));
            else {
                Feedbacks.find(function (err, feedbacks) {
                    if (err) return next(err);
                    else {
                        Feedbacks.populate(feedbacks, {path: 'user'}, function (err, posts) {
                            if (err) return next(err);
                            else res.status(200).json({
                                status: 200,
                                message: "OK",
                                data: {
                                    Feedbacks: posts
                                }
                            });
                        });
                    }
                });
            }
        });
    } catch (error) {
        return next(error);
    }
    /*

     var query = "SELECT * FROM ??";
     var table = ["Feedbacks"];
     try {
     query = mysql.format(query,table);
     req.app.locals.connection.query(query,function(err,rows){
     if(err) {
     return next(req.app.getError(500, "Internal error width database", err));
     } else {
     res.status(200).json({status : 200, message : "OK", data: { Feedbacks: rows }});
     }
     });
     }
     catch (error) {
     return next(error);
     }*/
});

/**
 * @api {get} /dashboardInfos/ Récupérer les informations de base du dashboard (doit être administrateur)
 * @apiVersion 1.0.0
 * @apiName Récupérer les informations de base du dashboard
 * @apiGroup Autres
 * @apiDescription Permet de récupérer les informations de base à afficher sur le dashboard (nombre d'utilisateurs, etc.).
 *
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object} DashboardInfos Liste des feedbacks
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
 * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 105 = L'utilisateur n'a pas les droits)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
 *
 */

router.get("/dashboardInfos", expressjwt({secret: process.env.jwtSecretKey}), function(req, res, next){


    if (req.user.id == "" || req.user.id == undefined)
        return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
    try {
        User.findOne({_id: req.user.id, admin: true}, function (err, user) {
            if (err) return next(err);
            else if (user == null) return next(req.app.getError(403, "Forbidden : user needs admin privileges.", null));
            else {
                req.app.get('mongoose').connection.db.listCollections().toArray(function(err, names) {
                    if (err) return next(err);
                    else {
                        var data = {};
                        for (var v = 0; v < names.length; v++) {
                            var tmp = names.length - 1;
                            req.app.get('mongoose').model(names[v].name).find({}).count({}, function(err, count) {
                                v--;
                                if (err) return next(error);
                                data[names[tmp - v].name] = count;
                                if (v == 0) {
                                    res.status(200).json({
                                        status      : 200,
                                        message     : "OK",
                                        data        : data
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    } catch (error) {
        return next(error);
    }
    /*
     try {
     if (req.user.role == 'Administrator') {
     var query = "SELECT * FROM ??";
     var table = ["AllDashboardInfos"];
     query = mysql.format(query,table);
     req.app.locals.connection.query(query,function(err,rows) {
     if (err) {
     return next(req.app.getError(500, "Internal error width database", err));
     } else {
     res.status(200).json({status : 200, message : "OK", data: { DashboardInfos: rows[0] }});
     }
     });
     } else {
     return next(req.app.getError(401, "User needs privileges.", null));
     }
     }
     catch (error) {
     return next(error);
     }*/
});

module.exports = router;
