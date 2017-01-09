/**
 * Created by kersal_e on 16/06/2016.
 */

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var expressjwt = require('express-jwt');
var CryptoJS = require('crypto-js');
var fs  = require('fs');
var shortid = require('shortid');
var Users = require('../../models/users');
var Comments = require('../../models/comments');
var Applications = require('../../models/applications');
var permissions = require("../permissions");

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
    permissions(["admin"]),
    function(req, res, next){
        try {
            Users.find().populate('rights').populate('author', "public").exec(function(err, users) {
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
    permissions(["logged"]),
    function(req, res, next){
        try {
            Users.findOne({id: req.user.id}).exec(function(err, user) {
                if (err) return next(err);
                else if (user == undefined || user == null) return next(req.app.getError(403, "Forbidden : invalid token", null));
                else Users.findOne({id: req.params.idUser}).populate("rights").populate("author").
                    populate([
                        {path: "public.applications", model:"applications"},
                        {path: "applications", model: "applications", populate: { path: "devicesName", model: "devices"}},
                        { path: "applications", model:"applications", populate: {path: "categoriesName", model:"categories"}},
                        { path: "purchase", model: "purchases", populate: {path: "application", select:"name", model: "applications"}}]).
                    exec(function(err, userSearch) {
                        if (err) return next(err);
                        else if (userSearch == null || userSearch == undefined) return next(req.app.getError(404, "User not found", null));
                        else
                        if (user.admin == true || user.id == userSearch.id)
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

router.get("/applications", function(req, res, next) {
    return next(req.app.getError(404, "Request deprecated. Report to GET /api/users/:idUser/applications ", null));
});

// /users/:idUser/applications
router.get("/:idUser/applications",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        try {
            Users.findOne({id : req.params.idUser}).populate('applications').exec(function(err, searchUser) {
                if (err) return next(err);
                else if (searchUser == undefined || searchUser == null) return next(req.app.getError(404, "User not found", null));
                else  res.status(200).json({
                        status          : 200,
                        message         : "OK",
                        data            : {
                            count       : searchUser.applications.length,
                            applications: searchUser.applications
                        }
                    });
            });
        }
        catch (error) {
            return next(error);
        }
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
    permissions(["admin", "me"]),
    function(req, res, next) {
        try {
            Users.findOneAndRemove({id: req.params.idUser}, function(err) {
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
    }
);



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
    permissions(["admin", "me"]),
    function(req, res, next){
        for (var key in req.body) {
            if (req.body[key] == "" || req.body[key] == null || req.body[key] == undefined) {
                return next(req.app.getError(404, "Bad request, parameters can't be null.", null));
            }
        }
        try {
            Users.findOne({id: req.params.idUser}, function(err, userSearch) {
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
                            else if (key == "picture" && req.body["picture"].buffer != undefined && req.body["picture"].filename != undefined) {
                                var filename = shortid.generate() + "." + req.body.picture.filename.split('.').pop();
                                var buff = new Buffer(req.body.picture.buffer
                                    .replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');
                                var path = "http://beavr.fr:3000/api/uploads/users/";
                                var old = userSearch.picture.substring(path.length, userSearch.picture.length);
                                userSearch.picture = path + filename;
                                userSearch.public.picture = userSearch.picture;
                                fs.writeFile('/home/API/uploads/users/' + filename, buff, function(err) {
                                    if(!err){
                                        fs.exists('/home/API/uploads/users/' + old, function(exists) {
;                                            if(exists) {
                                                fs.unlink('/home/API/uploads/users/' + old);
                                            }
                                        });
                                    }
                                    else {
                                        userSearch.picture = "http://www.outsystems.com/PortalTheme/img/UserImage.png?23465";
                                        userSearch.public.picture = "http://www.outsystems.com/PortalTheme/img/UserImage.png?23465";
                                    }
                                });
                            }
                            else {
                                if (key != "id")
                                    userSearch[key] = req.body[key];
                            }

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
 */ //// -------> Checked!!
router.post("/",
    permissions(["all"]),
    function(req,res, next) {
        if (req.body.pseudo == undefined || req.body.email == undefined || req.body.password == undefined) {
            return next(req.app.getError(400, "Bad request: one or multiple field incorrect.", {}));
        }
        try {
            var newUser = new Users();
            for (var key in req.body) {
                if (newUser[key] != undefined) {
                    if (key == "password")
                        newUser[key] = CryptoJS.SHA256(req.body[key]).toString();
                    else {
                        if (key != "admin" && key != "id")
                            newUser[key] = req.body[key];
                    }
                }
            }

            newUser.save(function(err) {
                if (err) return next(err);
                else {
                    var repos = '/home/API/uploads/creator/' + newUser._id;
                    if (!fs.existsSync(repos)){
                        fs.mkdirSync(repos);
                    }
                    res.status(200).json({
                        status  : 200,
                        message : "OK",
                        data    : {}
                    });
                } // OK
            });
        }  catch (error) {
            return next(error);
        }
    }
);

/*
 *  Permet de récupérer tous les commentaires d'un utilisateur
 *  Authorization nécessaire : admin ou user correspondant à l'utilisateur demandé
 *  Query acceptés : order=[ASC|DESC] & limit=[int]
 */
router.get("/:idUser/comments",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        try {
            Comments.find({ author: req.params.idUser }).
            sort({created_at: (req.query["order"] && req.query["order"] == "ASC") ? 1 : -1}).
            limit((req.query["limit"] && isNaN(parseInt(req.query["limit"])) == false) ? parseInt(req.query["limit"]) : 999).
            exec(function(err, comments) {
                if (err) return next(err);
                else res.status(200).json({
                    status      : 200,
                    message     : "OK",
                    data        : {
                        count   : (comments == undefined || comments == null) ? 0 : comments.length,
                        comments: (comments == undefined || comments == null) ? [] : comments
                    }
                });
            });
        } catch (error) {
            return next(error);
        }
    }
);

/*
 *  Permet de récupérer un commentaire posté sur une application par un utilisateur
 *  Authorization nécessaire : admin ou user correspondant à l'utilisateur demandé
 */
router.get("/:idUser/comments/:idApp",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        try {
            Applications.find({ id : req.params.idApp}, function(err, app) {
                if (err) return next(err);
                else if (app == null || app == undefined) return next(req.app.getError(404, "Not found : application unknown."));
                else next();
            });
        } catch (error) {
            return next(error);
        }
    },
    function(req, res, next) {
        try {
            Comments.findOne({ author: req.params.idUser, application: req.params.idApp }, function(err, comment) {
                if (err) return next(err);
                else
                    res.status(200).json({
                        status          : 200,
                        message         : "OK",
                        data            : (comment == null || comment == undefined) ? {} : {
                            comment     : comment
                        }
                    })
            });
        } catch (error) {
            return next(error);
        }
    }
);


/* GET /:idUser/progressions/:idApp
 * Récupérer la progression d'un utilisateur sur une application
 * */

router.get('/:idUser/progressions/:idApp',
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "logged"]),
    function(req, res, next) {
        try {
            Users.findOne({ id : req.user.id, progressions : { application: req.params.idApp }}, function(err, user) {
                if (err) return next(err);
                else if (user == undefined || user == null) return next(req.app.getError(404, "Not found : user probably doesn't possess this app."));
                else res.status(200).json({
                        status              : 200,
                        message             : "OK",
                        data                : {
                            progression     : user.progressions.filter(function(a) { return a.application == req.params.idApp; })[0]
                        }
                    });
            });
        } catch (error) {
            return next(error);
        }
    }
);

router.get('/:idUser/progressions',
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "logged"]),
    function(req, res, next) {
        try {
            Users.findOne({ id : req.user.id }, function(err, user) {
                if (err) return next(err);
                else if (user == undefined || user == null) return next(req.app.getError(404, "Not found : user probably doesn't possess this app."));
                else res.status(200).json({
                        status          : 200,
                        message         : "OK",
                        data            : {
                            progressions: (user.progressions == undefined || user.progressions == null) ? [] : user.progressions
                        }
                    });
            });
        } catch (error) {
            return next(error);
        }
    }
);

var Rights = require('../../models/rights');

router.get('/:idUser/developer/enabled',
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["me", "admin"]),
    function(req, res, next) {
        Rights.findOne({name: "Developer"}, function(err, right) {
            if (err) return next(err);
            else if (!right) return next(req.app.getError(404, "Not developer mode found"));
            else {
                Users.findOne({_id : req.params.idUser}, function(err, user) {
                   if (err) return next(err);
                    else if (!user) return next(req.app.getError(404, "User not found"));
                    else {
                        user.rights = right._id;
                       user.save(function(err) {
                           if (err) return next(err);
                           else return res.status(200).json({
                               status   : 200,
                               message  : "OK",
                               data     : {
                                   user : user
                               }
                           })
                       });
                   }
                });
            }
        });
    }
);

router.delete('/:idUser/developer/enabled',
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["me", "admin"]),
    function(req, res, next) {
        Users.findOne({_id: req.params.idUser}, function(err, user) {
            if (err) return next(err);
            else if (!user) return next(req.app.getError(404, "User not found"));
            else {
                Rights.findOne({name: User}, function(err, right) {
                   if (err) return next(err);
                    else if (!right) return next(req.app.getError(500, "Internal serveur error"));
                    else {
                        user.rights = right._id;
                       user.save(function(err) {
                           if (err) return next(err);
                           else return res.status(200).json({
                               status   : 200,
                               message  : "OK",
                               data     : {
                                   data : user
                               }
                           });
                       });
                   }
                });
            }
        })
    }
);


module.exports = router;
