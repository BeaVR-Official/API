/**
 * Created by kersal_e on 16/06/2016.
 */

//var mysql = require("mysql");
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var expressjwt = require('express-jwt');
var Users = require('../../models/users');
var CryptoJS = require('crypto-js');


/**
 * @api {get} /users Liste des utilisateurs
 * @apiVersion 1.0.0
 * @apiName Liste des utilisateurs
 * @apiGroup Gestion Utilisateurs
 * @apiDescription Retourne la liste de tous les utilisateurs.
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object[]} Users Liste des utilisateurs
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
  *       "Error": false,
  *       "Code" : 1,
  *       "Users" : [
  *         {
  *           "idUser": 1,
  *           "email": "j.dujardin@gmail.com",
  *           "pseudo": "JeanJean",
  *           "lastName": "Dujardin",
  *           "firstName": "Jean",
  *           "role": 4,
  *           "registration": "2015-12-05T06:24:33.000Z"
  *         },
  *         ...
  *       ]
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
router.get("/",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next) {
        if (req.user.id == "" || req.user.id == undefined)
            return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        try {
            Users.findOne({_id : req.user.id, admin : true}, function(err, user) {
                if (err) return next(err);
                else if (user == null || user == undefined) return next(req.app.getError(403, "Forbidden : user needs admin privileges.", null));
                else next();
            });
        } catch (error) {
            return next(error);
        }
    },
    function(req, res, next){
        try {
            Users.find(function(err, users) {
                if (err) return next(err);
                else res.status(200).json({
                    status      : 200,
                    message     : "OK",
                    data: {
                        count   : (users == undefined || users == null) ? 0 : users.length,
                        Users   : (users == undefined || users == null) ? [] : users
                    }
                });
            });
        } catch (error) {
            return next(error);
        }
        /*    try {
         if (req.user.role == 'Administrator') {
         var query = "SELECT * FROM ??";
         var table = ["AllUsersInfos"];

         query = mysql.format(query, table);

         req.app.locals.connection.query(query, function(err, rows){
         if (!err)
         res.status(200).json({status : 200, message : "OK", data: { Users: rows }});
         else
         return next(req.app.getError(500, "Internal error width database", err));
         });
         } else {
         return next(req.app.getError(403, "Forbidden : user needs privileges.", null));
         }
         }
         catch (error) {
         return next(error);
         }*/
    }
);

/**
 * @api {get} /users/:idUser Récupérer les informations d'un utilisateur
 * @apiVersion 1.0.0
 * @apiName Informations d'un utilisateur
 * @apiGroup Gestion Utilisateurs
 * @apiDescription Retourne les informations d'un utilisateur donné.
 *
 * @apiParam {Number} idUser ID de l'utilisateur souhaité
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object} Users Informations de l'utilisateur
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
  *       "Error": false,
  *       "Code" : 1,
  *       "Users" : {
  *           "idUser": 1,
  *           "email": "j.dujardin@gmail.com",
  *           "pseudo": "JeanJean",
  *           "lastName": "Dujardin",
  *           "firstName": "Jean",
  *           "role": 4,
  *           "registration": "2015-12-05T06:24:33.000Z"
  *       }
  *     }
 *
 * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
 * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'utilisateur n'existe pas, 105 = L'utilisateur n'a pas les droits)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
 *
 */
// modifier avec length = 0
router.get("/:idUser",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next) {
        if (req.user.id == "" || req.user.id == undefined)
            return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        if (req.params.idUser == undefined || req.params.idUser == "") {
            return next(req.app.getError(404, "Bad request, parameter missing.", null));
        }
        next();
    },
    function(req, res, next){
        try {
            Users.findOne({_id: req.user.id}, function(err, user) {
                if (err) return next(err);
                else if (user == undefined || user == null) return next(req.app.getError(403, "Forbidden : invalid token", null));
                else Users.findOne({_id: req.params.idUser}, function(err, userSearch) {
                        if (err) return next(err);
                        else if (userSearch == null || userSearch == undefined) return next(req.app.getError(404, "User not found", null));
                        else
                        if (user.admin == true || user._id == userSearch._id)
                            res.status(200).json({
                                status  : 200,
                                message : "OK",
                                data    : userSearch
                            });
                        else res.status(200).json({
                            status  : 200,
                            message : "OK",
                            data    : userSearch.public
                        });
                    });
            });
        } catch (error) {
            return next(error);
        }
        /*    try {
         if (req.user.role == 'Administrator') {
         var query = "SELECT * FROM ?? WHERE ??=?";
         var table = ["AllUsersInfos", "idUser", req.params.idUser];

         query = mysql.format(query, table);
         req.app.locals.connection.query(query, function(err, rows){
         if (!err)
         {
         if (rows.length == 0)
         return next(req.app.getError(404, "User not found", null)); // <---- Should be modified
         else
         res.status(200).json({status : 200, message : "OK", data: { Users: rows[0] }});
         }
         else
         return next(req.app.getError(500, "Internal error width database", err));
         });
         } else {
         return next(req.app.getError(403, "Forbidden : user needs privileges.", null));
         }
         }
         catch (error) {
         return next(error);
         }*/
    }
);

/**
 * @api {get} /users/applications/ Récupérer les applications d'un utilisateur
 * @apiVersion 1.0.0
 * @apiName Informations d'un utilisateur
 * @apiGroup Gestion Utilisateurs
 * @apiDescription Retourne les applications de l'utilisateur possédant le token passé en header.
 *
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object} Users Applications de l'utilisateur
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
  *       "Error": false,
  *       "Code" : 1,
  *       "Users" : {
  *           "id": 1,
  *           "name": "Superbe app",
  *           "description": "Description de ma superbe app",
  *           "buyer": "28",
  *           "retailer": "12",
  *           "logo": "http://beavr.fr/media/masuperbeapp.png",
  *           "url": "http://beavr.fr/app/masuperbeapp"
  *       }
  *     }
 *
 * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
 * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'utilisateur n'existe pas)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
 *
 */

// /users/:idUser/applications
router.get(":idUser/applications",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next) {
        if (req.user.id == "" || req.user.id == undefined)
            return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        if (req.params.idUser == undefined || req.params.idUser == "") {
            return next(req.app.getError(404, "Bad request, parameter missing.", null));
        }
        try {
            Users.findOne({_id : req.user.id}, function(err, user) {
                if (err) return next(err);
                else if (user == undefined || user == null) return next(req.app.getError(403, "Forbidden : invalid token", null));
                else {
                    if (user._id == req.params.idUser || user.admin == true)
                        next();
                    else return next(req.app.getError(403, "Forbidden : user needs admin privileges.", null));
                }
            });
        }
        catch (error) {
            return next(error);
        }
    },
    function(req, res, next) {
        try {
            Users.findOne({_id : req.params.idUser}, function(err, searchUser) {
                if (err) return next(err);
                else if (searchUser == undefined || searchUser == null) return next(req.app.getError(404, "User not found", null));
                else searchUser.populate('applications').exec(function(err, final) {
                        if (err) return next(err);
                        else res.status(200).json({
                            status          : 200,
                            message         : "OK",
                            data            : {
                                count       : final.applications.length,
                                applications: final.applications
                            }
                        });
                    });
            });
        }
        catch (error) {
            return next(error);
        }
        /*    try {
         var query = "SELECT * FROM ?? WHERE ??=?";
         var table = ["AllPurchasesInfos", "buyer", req.user.id];
         query = mysql.format(query, table);
         req.app.locals.connection.query(query, function(err, rows){
         if (!err) {
         if (rows.length == 0)
         return next(req.app.getError(404, "User not found", null)); // <---- Should be modified
         else
         res.status(200).json({status: 200, message: "OK", data: {Users: rows}});
         }
         else
         return next(req.app.getError(500, "Internal error width database", err));
         });
         }
         catch (error) {
         return next(error);
         }*/
    }
);

/**
 * @api {delete} /users/:idUser Supprimer un utilisateur
 * @apiVersion 1.0.0
 * @apiName Suppression d'un utilisateur
 * @apiGroup Gestion Utilisateurs
 * @apiDescription Supprime un utilisateur donné.
 *
 * @apiParam {Number} idUser ID de l'utilisateur souhaité
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
 * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'utilisateur n'existe pas, 105 = L'utilisateur n'a pas les droits)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
 *
 */
router.delete("/:idUser",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next) {
        if (req.user.id == "" || req.user.id == undefined)
            return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        if (req.params.idUser == undefined || req.params.idUser == "") {
            return next(req.app.getError(404, "Bad request, parameter missing.", null));
        }
        try {
            Users.findOne({_id: req.user.id}, function (err, user) {
                if (err) return next(err);
                else if (user == undefined || user == null) return next(req.app.getError(403, "Forbidden : invalid token", null));
                else if (user.admin == true || user._id == req.params.idUser) next();
                else return next(req.app.getError(403, "Forbidden : user needs privileges.", null));
            });
        }
        catch (error) {
            return next(error);
        }
        next();
    },
    function(req, res, next) {
        try {
            Users.findOneAndRemove({_id: req.params.idUser}, function(err) {
                if (err) return next(err);
                else res.status(200).json({
                    status  : 200,
                    message : "OK",
                    data    : {}
                });
            });
        } catch (error) {
            return next(error);
        }
        /*   try {
         if (req.user.role == 'Administrator') {
         var query = "DELETE FROM ?? WHERE ??=?";
         var table = ["Users", "idUser", req.params.idUser];

         query = mysql.format(query, table);
         req.app.locals.connection.query(query, function(err, rows){
         if (!err)
         {
         if (rows.affectedRows == 1)
         res.status(200).json({status: 200, message: "OK", data: {}});
         else
         return next(req.app.getError(404, "User not found", null));
         }
         else
         return next(req.app.getError(500, "Internal error width database", err));
         });
         } else {
         return next(req.app.getError(403, "Forbidden : user needs privileges.", null));
         }
         }
         catch (error) {
         return next(error);
         }*/
    });

/**
 * @api {put} /users/:idUser Modifier un utilisateur
 * @apiVersion 1.0.0
 * @apiName Modification des informations d'un utilisateur
 * @apiGroup Gestion Utilisateurs
 * @apiDescription Modifier les informations d'un utilisateur donné.
 *
 * @apiParam {String} email Adresse mail de l'utilisateur
 * @apiParam {String} password Mot de passe de l'utilisateur
 * @apiParam {String} name Nom de l'utilisateur
 * @apiParam {String} firstname Prénom de l'utilisateur
 * @apiParam {Number} role Rôle de l'utilisateur
 * @apiParam {Number} idUser ID de l'utilisateur souhaité
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object} Users Informations de l'utilisateur
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
  *       "Error": false,
  *       "Code" : 1,
  *       "Users" : {
  *           "idUser": 1,
  *           "email": "j.dujardin@gmail.com",
  *           "pseudo": "JeanJean",
  *           "password": "a94a8fe5ccb19ba61c4c0873d391e9879ffa353a",
  *           "lastName": "Dujardin",
  *           "firstName": "Jean",
  *           "role": 4,
  *           "registration": "2015-12-05T06:24:33.000Z"
  *       }
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
router.put("/:idUser",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next) {
        if (req.user.id == "" || req.user.id == undefined)
            return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        if (req.params.idUser == undefined || req.params.idUser == "") {
            return next(req.app.getError(404, "Bad request, parameter missing.", null));
        }
        for (var key in req.body) {
            if (req.body[key] == "" || req.body[key] == null || req.body[key] == undefined) {
                return next(req.app.getError(404, "Bad request, parameters can't be null.", null));
            }
        }
        try {
            Users.findOne({_id : req.user.id}, function(err, user) {
                if (err) return next(err);
                else if (user == null || user == undefined) return next(req.app.getError(403, "Forbidden : invalid token", null));
                else if (user.admin == true || user._id == req.params.idUser) {
                    return next(); // Accepte la requête si l'utilisateur est admin ou utilisateur à qui appartient le profil
                }
                else return next(req.app.getError(403, "Forbidden : user needs privileges.", null));
            });
        } catch (error) {
            return next(error);
        }
    },
    function(req, res, next){
        try {
            Users.findOne({_id: req.params.idUser}, function(err, userSearch) {
                if (err) return next(err);
                else if (userSearch == null || userSearch == undefined) return next(req.app.getError(404, "User not found", null));
                else {
                    for (var key in req.body) {
                        if (userSearch[key] != undefined) {
                            if (key == "password")
                                userSearch[key] = CryptoJS.SHA256(req.body[key]).toString();
                            else if (key == "admin") {
                                if (user.admin == true)
                                    userSearch[key] = req.body[key];
                            }
                            else
                            if (key != "_id")
                                userSearch[key] = req.body[key];
                        }
                    }
                    userSearch.save(function(err) {
                        if (err) return next(err);
                        else res.status(200).json({
                            status      : 200,
                            message     : "OK",
                            data        : {
                                user    : userSearch
                            }
                        });
                    });
                }
            });
        } catch (error) {
            return next(error);
        }
        /*
         try {
         if (req.user.role == 'Administrator') {
         var query = "SELECT * FROM ?? WHERE ??=?";
         var table = ["Users", "idUser", req.params.idUser];

         query = mysql.format(query, table);
         req.app.locals.connection.query(query, function(err, rows){
         if (!err)
         {
         if (rows == 0)
         return next(req.app.getError(404, "User not found", null)); // <---- Should be modified
         else
         {
         var query = "UPDATE Users SET `email`= ?,`pseudo`= ?, `password`= ?,`lastName`= ?,`firstName`= ?,`role`= ? WHERE `idUser` = ?";
         var table = [req.body.email, req.body.pseudo, sha1(req.body.password), req.body.lastName, req.body.firstName, req.body.role, req.params.idUser];

         query = mysql.format(query, table);
         req.app.locals.connection.query(query, function(err, rows){
         if (!err) {
         res.status(200).json({status: 200, message: "OK", data: { Users : rows[0]}});
         }
         else
         return next(req.app.getError(500, "Internal error width database", err));
         });
         }
         }
         else
         return next(req.app.getError(500, "Internal error width database", err));
         });
         } else {
         return next(req.app.getError(403, "Forbidden : user needs privileges.", null));
         }
         }
         catch (error) {
         return next(error);
         }*/
    }
);

/**
 * @api {post} /users/ Ajouter un utilisateur
 * @apiVersion 1.0.0
 * @apiName Ajout d'un utilisateur
 * @apiGroup Gestion Utilisateurs
 * @apiDescription Ajoute un utilisateur après avoir vérifier qu'il n'existait pas.
 *
 * @apiParam {String} email Adresse mail de l'utilisateur
 * @apiParam {string} pseudo Le pseudonyme de l'utilisateur
 * @apiParam {String} password Mot de passe de l'utilisateur
 * @apiParam {String} lastName Nom de l'utilisateur
 * @apiParam {String} firstName Prénom de l'utilisateur
 * @apiParam {String} role Rôle de l'utilisateur
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
  *       "Error": false,
  *       "Code" : 1,
  *     }
 *
 * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
 * @apiError (Erreur) {Number} Code Code d'erreur (101 = L'utilisateur existe déjà, 102 = Erreur lors de la requête)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
  *       "Error" : true,
  *       "Code" : 101
  *     }
 *
 */
router.post("/",
    function(req, res, next) {
        if (req.body.pseudo == undefined || req.body.email == undefined || req.body.password == undefined) {
            return next(req.app.getError(400, "Bad request: one or multiple field incorrect.", {}));
        }
        next();
    },
    function(req,res, next) {
        try {
            var newUser = new Users();
            for (var key in req.body) {
                if (newUser[key] != undefined) {
                    if (key == "password")
                        newUser[key] = CryptoJS.SHA256(req.body[key]).toString();
                    else {
                        if (key != "admin" && key != "_id")
                            newUser[key] = req.body[key];
                    }
                }
            }
            newUser.save(function(err) {
                if (err) return next(err);
                else res.status(200).json({
                    status  : 200,
                    message : "OK",
                    data    : {}
                }); // OK
            });
        }  catch (error) {
            return next(error);
        }
        /* try {
         var query = "INSERT INTO ??(??,??,??,??,??,??) VALUES (?,?,?,?,?,?)";
         var table = ["Users", "email", "pseudo", "password", "lastName", "firstName", "role",
         req.body.email, req.body.pseudo, sha1(req.body.password), req.body.lastName, req.body.firstName, req.body.role];

         query = mysql.format(query,table);

         req.app.locals.connection.query(query,function(err,rows){
         if (!err)
         res.status(200).json({status: 200, message: "OK", data: { }});
         else {
         if (err.code == "ER_DUP_ENTRY")
         return next(req.app.getError(409, "Conflict: user already exist", null));
         else
         return next(req.app.getError(400, "Bad request", null));
         }
         });
         }
         catch (error) {
         return next(error);
         }*/
    }
);

module.exports = router;
