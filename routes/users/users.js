/**
 * Created by kersal_e on 16/06/2016.
 */

var mysql = require("mysql");
var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var jwt = require('jsonwebtoken');
var expressjwt = require('express-jwt');

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
router.get("/", expressjwt({secret: process.env.jwtSecretKey}), function(req, res, next){
    try {
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
    }
});

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
router.get("/:idUser(\\d+)/", expressjwt({secret: process.env.jwtSecretKey}), function(req, res, next){
    try {
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
    }
});

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
router.get("/applications/", expressjwt({secret: process.env.jwtSecretKey}), function(req, res, next){
    try {
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
    }
}); 

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
router.delete("/:idUser", expressjwt({secret: process.env.jwtSecretKey}), function(req, res, next){
    try {
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
    }
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
router.put("/:idUser", expressjwt({secret: process.env.jwtSecretKey}), function(req, res, next){
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
    }
});

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
router.post("/", function(req,res, next){
    try {
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
    }
});

module.exports = router;
