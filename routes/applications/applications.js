/**
 * Created by kersal_e on 16/06/2016.
 */

var express = require('express');
var router = express.Router();
var expressjwt = require('express-jwt');


/**
 * @api {get} /applications/ Liste des applications
 * @apiVersion 1.0.0
 * @apiName Liste des applications
 * @apiGroup Gestion Applications
 * @apiDescription Retourne la liste de toutes les applications.
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object[]} Applications Liste des applications
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
*       "Error": false,
*       "Code" : 1,
*       "Applications" : [
*         {
*           "name": "Application",
*           "description": "Ceci est la description de l'application",
*           "creationDate": "2016-01-31T15:00:00.000Z",
*           "price": 29.99,
*           "logo": "Url du logo",
*           "url": "Lien vers l'application",
*           "categoriesNames": "Mathématique, Astrologie",
*           "devicesNames": "Leap Motion",
*           "authorName": "Jean Dujardin"
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
router.get("/", function(req, res, next) {
    try {
        var query = {};
        var schema = {
            name            : "",
            categoriesName  : [],
            devicesNames    : [],
            authorNamme     : ""
        };
        for (var key in req.query) {
            if (req.query[key] != undefined && schema[key] != undefined) {
                if ((key == "categoriesName" || key == "devicesName") && Array.isArray(req.query[key]))
                    query[key] = req.query[key];
                else
                    query[key] = req.query[key];
            }

        }
        req.app.get('mongoose').model('applications').find(query, function(err, applications) {
            if (err) return next(err);
            else res.status(200).json({
                status          : 200,
                message         : "OK",
                data            : (applications == undefined || applications == null) ? { count : 0 }: {
                    count       : applications.length,
                    application : applications
                }
            });
        });
    } catch (error) {
        return next(error);
    }
    /*    try {
     var query = "SELECT * FROM `AllApplicationsInfos`";

     req.app.locals.connection.query(query, function(err, rows){
     if (!err)
     res.status(200).json({status: 200, message: "OK", data: {Applications: rows}});
     else
     return next(req.app.getError(500, "Internal error width database", err));
     });
     }
     catch (error) {
     return next(error);
     }*/
});

/* GET /applications/pending
 * Retourne la liste des applications en attente de validation
 * Si admin renvoie toute la liste
 * Si user renvoie ses applications déposées en attente de validation
 * */
router.get("/pending",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next){
        if (req.user.id == null || req.user.id == undefined) return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        try {
            req.app.get('mongoose').model('users').findOne({_id: req.user.id}, function (err, user) {
                if (err) return next(err);
                else if (user == null || user == undefined) return next(req.app.getError(403, "Unauthorized : invalid token", null));
                else {
                    req.user.admin = user.admin;
                    next();
                }
            });
        } catch (error) {
            return next(error);
        }
    },
    function(req, res, next) {
        try {
            if (req.user.admin == true) {
                req.app.get('mongoose').model('validation').find({type: 'application'}).
                sort({created_at: 1}).
                exec(function(err, pending) {
                    if (err) return next(err);
                    else res.status(200).json({
                        status      : 200,
                        message     : "OK",
                        data        : (pending == null || pending == undefined) ? {} : {
                            count   : pending.length,
                            pending : pending
                        }
                    });
                })
            }
            else {
                req.app.get('mongoose').model('validation').find({type: 'application', author: req.user.id}).
                sort({created_at: 1}).
                exec(function(err, pending) {
                    if (err) return next(err);
                    else res.status(200).json({
                        status      : 200,
                        message     : "OK",
                        data        : (pending == null || pending == undefined) ? {} : {
                            count   : pending.length,
                            pending : pending
                        }
                    });
                })
            }
        } catch (error) {
            return next(error);
        }
        /*    try {
         var query = "SELECT * FROM `AllApplicationsInfos` WHERE ??=?";
         var table = ["state", req.params.state];

         query = mysql.format(query, table);
         req.app.locals.connection.query(query, function(err, rows){
         if (!err)
         {
         if (rows.length == 0)
         return next(req.app.getError(404, "State not found", null)); // <---- Should be modified
         else {
         res.status(200).json({status: 200, message: "OK", data: {Applications: rows}});
         }
         }
         else
         return next(req.app.getError(500, "Internal error width database", err));
         });
         } catch (error) {
         return next(error);
         }*/
    });

/* POST /applications/pending/:idApp/validate
 * Publie une application en attente de validation
 * */
router.post("/pending/:idApp/validate",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next){
        if (req.user.id == null || req.user.id == undefined) return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        try {
            req.app.get('mongoose').model('users').findOne({_id: req.user.id}, function (err, user) {
                if (err) return next(err);
                else if (user == null || user == undefined) return next(req.app.getError(403, "Unauthorized : invalid token", null));
                else if (user.admin != true) return next(req.app.getError(403, "Unauthorized : needs admin privileges", null));
                else next();
            });
        } catch (error) {
            return next(error);
        }
    },
    function(req, res, next) {
        try {
            req.app.get('mongoose').model('validation').findOne({_id : req.params.idApp, type: 'application'}, function(err, application) {
                if (err) return next(err);
                else if (application == null || application == undefined) return next(req.app.getError(404, "Not found : verify id match with pending application", null));
                else {
                    var newApplication = req.app.get('mongoose').model('applications')();
                    for (var key in application.application)
                        newApplication[key] = application.application[key];
                    newApplication.save(function(err) {
                        if (err) return next(err);
                        else {
                            res.status(200).json({
                                status          : 200,
                                message         : "OK",
                                data            : {}
                            });
                            application.delete();
                        }
                    })
                }
            });
        } catch (error) {
            return next(error);
        }
    }
);

/* DELETE /applications/pending/:idApp
 * Supprime une requête en attente de validation
 * */
router.delete("/pending/:idApp",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next){
        if (req.user.id == null || req.user.id == undefined) return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        try {
            req.app.get('mongoose').model('users').findOne({_id: req.user.id}, function (err, user) {
                if (err) return next(err);
                else if (user == null || user == undefined) return next(req.app.getError(403, "Unauthorized : invalid token", null));
                else {
                    req.user.admin = user.admin;
                    next();
                }
            });
        } catch (error) {
            return next(error);
        }
    },
    function(req, res, next) {
        try {
            req.app.get('mongoose').model('validation').findOne({ _id : req.params.idApp }, function(err, app) {
                if (err) return next(err);
                else if (app == null || app == undefined) return next(req.app.getError(404, "Not found : unknown application", null));
                else {
                    if (req.user.admin == true || req.user.id == app.author) {
                        app.delete(function(err) {
                            if (err) return next(err);
                            else res.status(200).json({
                                status      : 200,
                                message     : "Successfully deleted",
                                data        : {}
                            });
                        });
                        return next();
                    }
                    else {
                        return next(req.app.getError(403, "Unauthorized : user not allowed to delete this app", null));
                    }
                }
            })
        } catch (error) {
            return next(error);
        }
    }
);

/* GET /api/applications/pending/:idApp
 *  Retourne une application en attente de validation
 * */
router.get("/pending/:idApp",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next){
        if (req.user.id == null || req.user.id == undefined) return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        try {
            req.app.get('mongoose').model('users').findOne({_id: req.user.id}, function (err, user) {
                if (err) return next(err);
                else if (user == null || user == undefined) return next(req.app.getError(403, "Unauthorized : invalid token", null));
                else if (user.admin != true) return next(req.app.getError(403, "Unauthorized : needs admin privileges", null));
                else next();
            });
        } catch (error) {
            return next(error);
        }
    },
    function(req, res, next) {
        try {
            req.app.get('mongoose').model('validation').findOne({_id : req.params.idApp, type: 'application'}, function(err, application) {
                if (err) return next(err);
                else if (application == null || application == undefined) return next(req.app.getError(404, "Not found : verify id match with pending application", null));
                else res.status(200).json({
                        status          : 200,
                        message         : "OK",
                        data            : {
                            application : application
                        }
                    });
            });
        } catch (error) {
            return next(error);
        }
    }
);


/**
 * @api {get} /applications/:idApplication Récupérer les informations d'une application
 * @apiVersion 1.0.0
 * @apiName Informations d'une application
 * @apiGroup Gestion Applications
 * @apiDescription Retourne les informations d'une application donnée.
 *
 * @apiParam {Number} idApplication ID de l'application
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object} Applications Informations de l'application
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
*       "Error": false,
*       "Code" : 1,
*       "Applications" : {
    *           "name": "Application",
    *           "description": "Ceci est la description de l'application",
    *           "creationDate": "2016-01-31T15:00:00.000Z",
    *           "price": 29.99,
    *           "logo": "Url du logo",
    *           "url": "Lien vers l'application",
    *           "categoriesNames": "Mathématique, Astrologie",
    *           "devicesNames": "Leap Motion",
    *           "authorName": "Jean Dujardin"
    *       }
*     }
 *
 * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
 * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'application n'existe pas)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
*       "Error" : true,
*       "Code" : 102
*     }
 */
router.get("/:idApplication", function(req, res, next) {
    try {
        req.app.get('mongoose').model('applications').findOne({ _id : req.params.idApplication }, function(err, app) {
            if (err) return next(err);
            else if (app == undefined || app == null) return next(req.app.getError(404, "Not found : application not found", null));
            else res.status(200).json({
                    status          : 200,
                    message         : "OK",
                    data            : {
                        application : app
                    }
                });
        });
    } catch (error) {
        return next(error);
    }
    /* try {
     var query = "SELECT * FROM `AllApplicationsInfos` WHERE ??=?";
     var table = ["id", req.params.idApplication];

     query = mysql.format(query, table);
     req.app.locals.connection.query(query, function(err, rows){
     if (!err)
     {
     if (rows.length == 0)
     return next(req.app.getError(404, "Application not found", null));
     else {
     res.status(200).json({status: 200, message: "OK", data: {Applications: rows[0]}});
     }
     }
     else
     return next(req.app.getError(500, "Internal error width database", err));
     });
     } catch (error) {
     return next(error);
     }*/
});

/**
 * @api {delete} /applications/:idApplication Supprimer une application
 * @apiVersion 1.0.0
 * @apiName Suppression d'une application
 * @apiGroup Gestion Applications
 * @apiDescription Supprimer une application.
 *
 * @apiParam {Number} idApplication ID de l'application
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
 * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'application n'existe pas)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
*       "Error" : true,
*       "Code" : 102
    *     }
 *
 */
router.delete("/:idApplication",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next){
        if (req.user.id == null || req.user.id == undefined) return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        try {
            req.app.get('mongoose').model('users').findOne({_id: req.user.id}, function (err, user) {
                if (err) return next(err);
                else if (user == null || user == undefined) return next(req.app.getError(403, "Unauthorized : invalid token", null));
                else {
                    req.user.admin = user.admin;
                    next();
                }
            });
        } catch (error) {
            return next(error);
        }
    },
    function(req, res, next) {
        try {
            req.app.get('mongoose').model('applications').findOne({ _id : req.params.idApplication }, function(err, app) {
                if (err) return next(err);
                else if (req.user.admin == true || req.user.id == app.author) {
                    app.remove(function(err) {
                        if (err) return next(err);
                        else res.status(200).json({
                            status      : 200,
                            message     : "Successfully deleted",
                            data        : {}
                        });
                    });
                    return next();
                }
                else {
                    return next(req.app.getError(403, "Unauthorized : user not allowed to delete this app", null));
                }
            })
        } catch (error) {
            return next(error);
        }
        /*    try {
         var query = "DELETE FROM ?? WHERE ??=?";
         var table = ["Applications", "idApplication", req.params.idApplication];

         query = mysql.format(query, table);
         req.app.locals.connection.query(query, function(err, rows){
         if (!err)
         {
         if (rows.affectedRows == 1)
         res.status(200).json({status: 200, message: "OK", data: {}});
         else {
         return next(req.app.getError(404, "Application not found", null));
         }
         }
         else
         return next(req.app.getError(500, "Internal error width database", err));
         });
         } catch (error) {
         return next(error);
         }*/
    });

/**
 * @api {post} /applications/ Ajouter une application
 * @apiVersion 1.0.0
 * @apiName Ajout d'une application
 * @apiGroup Gestion Applications
 * @apiDescription Ajouter une application.
 *
 * @apiParam {String} name Nom de l'application
 * @apiParam {String} description Description de l'application
 * @apiParam {Date} creationdate Date de création de l'application
 * @apiParam {Number} price Prix de l'application
 * @apiParam {Number} creator ID de l'auteur de l'application
 * @apiParam {String} url Lien vers l'application
 * @apiParam {Number} state Statut de l'application
 * @apiParam {Number} logo ID du logo de l'application
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
 * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'application n'existe pas)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
*       "Error" : true,
*       "Code" : 102
*     }
 *
 */
router.post("/",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next) {
        if (req.user.id == null || req.user.id == undefined) return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        if (req.body.name == undefined || req.body.name == "" ||
            req.body.description == undefined || req.body.description == "" ||
            req.body.price == undefined || req.body.price == "" ||
            req.body.logo == undefined || req.body.logo == "" ||
            req.body.url == undefined || req.body.url == "" ||
            req.body.devices == undefined || req.body.devices == "" ||
            req.body.categories == undefined || req.body.categories == "")
            return next(req.app.getError(400, "Bad request : incorrect or missing parameters", null));
        try {
            req.app.get('mongoose').model('users').findOne({_id: req.user.id}, function (err, user) {
                if (err) return next(err);
                else if (user == null || user == undefined) return next(req.app.getError(403, "Unauthorized : invalid token", null));
                else next();
            });
        } catch (error) {
            return next(error);
        }
    }, function(req,res, next) {
        try {
            var newValidationApp = new req.app.get('mongoose').model('validation')({
                type            : "application",
                application     : {
                    name            : req.body.name,
                    description     : req.body.description,
                    logo            : req.body.logo,
                    url             : req.body.url,
                    categoriesName  : req.body.categories,
                    devicesNames    : req.body.devices,
                    authorName      : req.user.id,
                    price           : req.user.price
                }
            });
            newValidationApp.save(function(err) {
                if (err) return next(err);
                else res.status(200).json({
                    status          : 200,
                    message         : "Application saved. Please wait for admin review.",
                    data            : {
                        pending     : newValidationApp
                    }
                });
            });
        } catch (error) {
            return next(error);
        }
        /* try {
         var query = "INSERT INTO ??(??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
         var table = ["Applications", "name", "description", "creationDate", "price", "creator", "url", "state", "logo",
         req.body.name, req.body.description, (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' '),
         req.body.price, req.body.creator, req.body.url, req.body.state, req.body.logo];

         query = mysql.format(query,table);

         req.app.locals.connection.query(query, function(err,rows){
         if (!err)
         res.status(200).json({status: 200, message: "OK", data: {}});
         else
         return next(req.app.getError(500, "Internal error width database", err));
         });
         } catch (error) {
         return next(error);
         }*/
    });

/**
 * @api {get} /progressions/:idApplication Récupérer la progression
 * @apiVersion 1.0.0
 * @apiName Récupérer la progression
 * @apiGroup Gestion Applications
 * @apiDescription Récupérer la progression d'un utilisateur sur une application.
 *
 * @apiParam {Number} idApplication ID de l'application
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
*       "Error": false,
*       "Code" : 1
    *       "Progression" : {
    *         "idApplication" : 1,
    *         "hashProgression" : "jDSNCbaKGyEMFORIarCe80lI3lzt9e9zizppM3WoGgP6uywBIp"
    *       }
*     }
 *
 * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
 * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 201 = Aucune progression)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
*       "Error" : true,
*       "Code" : 102
*     }
 *
 */
router.get("/:idApplication/progressions", function(req, res, next) {
    return next(req.app.getError(404, "Request deprecated. See GET /api/users/:idUser/progressions", null));
    /* try {
     var query = "SELECT * FROM ?? WHERE ??=?";
     var table = ["Progressions", "application", req.params.idApplication];

     query = mysql.format(query, table);
     req.app.locals.connection.query(query, function(err, rows){
     if (!err)
     {
     if (rows.length == 0)
     return next(req.app.getError(404, "Progression not found", null)); // <---- Should be modified
     else
     res.status(200).json({status: 200, message: "OK", data: {Progression: rows}});
     }
     else
     return next(req.app.getError(500, "Internal error width database", err));
     });
     } catch (error) {
     return next(error);
     }*/
});

/**
 * @api {put} /progressions/:idApplication Mettre à jour la progression d'une application
 * @apiVersion 1.0.0
 * @apiName Mettre à jour la progression
 * @apiGroup Gestion Applications
 * @apiDescription Permet de mettre à jour la progression d'un utilisateur sur une application.
 *
 * @apiParam {String} hashProgression Progression de l'utilisateur
 * @apiParam {Number} idApplication ID de l'application
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object} Applications Informations de l'application
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
router.put("/:idApplication/progressions", function(req, res, next) {
    return next(req.app.getError(404, "Request deprecated. See GET /api/users/:idUser/progressions/:idApp", null));
    /*    try {
     var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
     var table = ["Progressions", "hashProgression" , req.body.hashProgression, "application", req.params.idApplication];

     query = mysql.format(query, table);
     req.app.locals.connection.query(query, function(err, rows){
     if (!err)
     res.status(200).json({status: 200, message: "OK", data: {}});
     else
     return next(req.app.getError(500, "Internal error width database", err));
     });
     } catch (error) {
     return next(error);
     }*/
});

/**
 * @api {put} /validateApplicationSubmission/:idApp Valide une application soumise par un développeur
 * @apiVersion 1.0.0
 * @apiName Valide une application soumise par un développeur
 * @apiGroup Gestion Applications
 * @apiDescription Valide une application soumise par un développeur.
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
router.post("/:idApplication/validateApplicationSubmission",function(req,res, next) {
    return next(req.app.getError(404, "Request deprecated. See GET /api/applications/pending/:idApp/validate", null));
    /*    try {
     var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
     var table = ["Applications","state","1","idApplication",req.params.idApplication];
     query = mysql.format(query,table);
     req.app.locals.connection.query(query,function(err,rows){
     if(err) {
     return next(req.app.getError(500, "Internal error width database", err));
     } else {
     res.status(200).json({status: 200, message: "OK", data: {}});
     }
     });
     } catch (error) {
     return next(error);
     }*/
});

/**
 * @api {put} /updateApplicationInfos Modifier les informations d'une application
 * @apiVersion 1.0.0
 * @apiName Modifier les informations d'une application
 * @apiGroup Gestion Applications
 * @apiDescription Modifier les informations d'une application.
 *
 * @apiParam {String} name Nom de l'application
 * @apiParam {String} description Description de l'application
 * @apiParam {Number} price Prix de l'application
 * @apiParam {Number} headdevice ID du casque de réalité virtuelle
 * @apiParam {Number} handsdevice ID des gants de réalité virtuelle
 * @apiParam {Number} category Catégorie dans laquelle est classée l'application
 * @apiParam {Number} idApp ID de l'application
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
router.put("/:idApplication",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next) {
        if (req.user.id == null || req.user.id == undefined) return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        for (var key in req.body)
            if (req.body[key] == "")
                return next(req.app.getError(400, "Bad request : cannot change a value with empty one", null));
        try {
            req.app.get('mongoose').model('users').findOne({_id: req.user.id}, function (err, user) {
                if (err) return next(err);
                else if (user == null || user == undefined) return next(req.app.getError(403, "Unauthorized : invalid token", null));
                else next();
            });
        } catch (error) {
            return next(error);
        }
    },
    function(req, res, next) {
        try {
            req.app.get('mongoose').model('applications').findOne({ author : req.user.id}, function(err, res) {
                if (err) return next(err);
                else if (res == null || res == undefined) return next(req.app.getError(404, "Not found: please verify that application belongs to current user"));
                else {
                    for (var key in req.body) {
                        if (res[key] != undefined)
                            res[key] = req.body[key];
                    }
                    res.save(function(err) {
                        if (err) return next(err);
                        else res.status(200).json({
                            status          : 200,
                            message         : "OK",
                            data            : {
                                application : res
                            }
                        });
                    });
                }
            })
        } catch (error) {
            return next(error);
        }
        /*    try {
         var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
         var table = ["applications","name",req.body.name,
         "description",req.body.description,
         "price",req.body.price,
         "headdevice",req.body.headdevice,
         "handsdevice",req.body.handsdevice,
         "category",req.body.category,
         "idApplication",req.params.idApplication];
         query = mysql.format(query,table);
         req.app.locals.connection.query(query,function(err,rows){
         if(err) {
         return next(req.app.getError(500, "Internal error width database", err));
         } else {
         res.status(200).json({status: 200, message: "OK", data: {}});
         }
         });
         } catch (error) {
         return next(error);
         }*/
    });


/**
 * @api {get} /:idApp/comments Liste des commentaires d'une application
 * @apiVersion 1.0.0
 * @apiName Liste des commentaires d'une application
 * @apiGroup Gestion Commentaires
 * @apiDescription Récupérer la liste des commentaires d'une application donnée.
 *
 * @apiParam {Number} idApp ID de l'application
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object[]} Comments Liste des commentaires
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
*       "Error": false,
*       "Code" : 1,
*       "Comments" : [
    *         {
    *           "idComment": 1,
*           "comment": "Ceci est un commentaire",
*           "rating": 5,
*           "author": 1,
*           "picture_profile": "Lien vers la photo de profil",
*           "application": 1,
*           "date": "2016-04-14T18:51:57.000Z",
*           "title": "Titre"
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
router.get("/:idApp/comments",
    function(req, res, next) {
        try {
            req.app.get('mongoose').model('applications').findOne({_id : req.params.idApp}, function(err, app) {
                if (err) return next(err);
                else if (app == null || app == undefined) return next(req.app.getError(404, "Not found: application unknown", null));
                else next();
            });
        }  catch (error) {
            return next(error);
        }
    },
    function(req,res, next){
        try {
            req.app.get('mongoose').model('comments').find({ application: req.params.idApp }).
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
        } catch(error) {
            return next(error);
        }
        /*        try {
         var query = "SELECT * FROM `AllCommentsInfos` WHERE ??=? ORDER BY date DESC";
         var table = ["application",req.params.idApp];

         query = mysql.format(query,table);
         req.app.locals.connection.query(query,function(err,rows){
         if(err) {
         return next(req.app.getError(500, "Internal error width database", err));
         } else {
         res.status(200).json({status: 200, message: "OK", data: {Comments: rows}});
         }
         });
         }
         catch (error) {
         return next(error);
         }*/
    }
);

/**
 * @api {delete} /comment/:idComment Supprimer un commentaire
 * @apiVersion 1.0.0
 * @apiName Supprimer un commentaire
 * @apiGroup Gestion Commentaires
 * @apiDescription Supprimer un commentaire.
 *
 * @apiParam {Number} idComment ID du commentaire
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
router.delete("/:idApp/comments/:idComment",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next) {
        if (req.user.id == null || req.user.id == undefined) return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        try {
            req.app.get('mongoose').model('users').findOne({_id: req.user.id}, function (err, user) {
                if (err) return next(err);
                else if (user == null || user == undefined) return next(req.app.getError(403, "Unauthorized : invalid token", null));
                else if (user.admin != true) return next(req.app.getError(403, "Unauthorized : require admin privileges", null));
                else {
                    req.app.get('mongoose').model('applications').findOne({_id: req.params.idApp}, function (err, app) {
                        if (err) return next(err);
                        else if (app == null || app == undefined) return next(req.app.getError(404, "Not found : invalid application id", null));
                        else next();
                    });
                }
            });
        } catch (error) {
            return next(error);
        }
    },
    function(req,res, next) {
        try {
            req.app.get('mongoose').model('comments').findOne({id: req.params.idComment, application: req.params.idApp}, function (err, comment) {
                if (err) return next(err);
                else if (comment == null || comment == undefined) return next(req.app.getError(404, "Not found: comment not accessible or not found"), null);
                else {
                    comment.remove(function(err) {
                        if (err) return next(err);
                        else res.status(200).json({
                            status      : 200,
                            message     : "Successfully deleted",
                            data        : {}
                        });
                    });
                }
            })
        }
        catch (error) {
            return next(error);
        }
        /*  try {
         var query = "DELETE from ?? WHERE ??=?";
         var table = ["Comments","idComment",req.params.idComment];
         query = mysql.format(query,table);
         req.app.locals.connection.query(query,function(err,rows){
         if(err) {
         return next(req.app.getError(500, "Internal error width database", err));
         } else {
         res.status(200).json({status: 200, message: "OK", data: {}});
         }
         });
         }
         catch (error) {
         return next(error);
         }*/
    }
);


/**
 * @api {post} /comments Publier un commentaire
 * @apiVersion 1.0.0
 * @apiName Publier un commentaire
 * @apiGroup Gestion Commentaires
 * @apiDescription Poste un commentaire sur une application.
 *
 * @apiParam {String} comment Commentaire de l'utilisateur
 * @apiParam {Number} rating Note donnée par l'utilisateur à l'application
 * @apiParam {Number} author ID de l'utilisateur
 * @apiParam {Number} application ID de l'application
 * @apiParam {Date} date Date du commentaire
 * @apiParam {String} title Titre du commentaire
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
router.post("/:idApp/comments",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next) {
        if (req.user.id == null || req.user.id == undefined) return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        if (req.body.title == undefined || req.body.title == "" ||
            req.body.comment == undefined || req.body.comment == "")
            return next(req.app.getError(404, "Bad request: one or multiple parameters missing.", null));
        try {
            req.app.get('mongoose').model('users').findOne({_id : req.user.id}, function(err, user) {
                if (err) return next(err);
                else if (user == null || user == undefined) return next(req.app.getError(403, "Unauthorized : invalid token", null));
                else  {
                    req.app.get('mongoose').model('applications').findOne({ _id : req.params.idApp}, function(err, app) {
                        if (err) return next(err);
                        else if (app == null || app == undefined) return next(req.app.getError(404, "Not found : invalid application id", null));
                        else {
                            req.app.get('mongoose').model('comments').findOne({ author: req.user.id, application: req.params.idApp }, function(err, comment) {
                                if (err) return next(err);
                                else if (comment) return next(req.app.getError(409, "Conflict: user has already commented this app"), null);
                                else next();
                            })
                        }
                    });
                }
            });
        } catch (error) {
            return next(error);
        }
    },
    function(req,res, next){
        try {
            var newComment = new req.app.get('mongoose').model('comments')({
                title       : req.body.title,
                comment     : req.body.comment,
                rating      : req.body.rating,
                application : req.params.idApp
            });
            newComment.save(function(err){
                if (err) return next(err);
                else res.status(200).json({
                    status      : 200,
                    message     : "OK",
                    data        : {}
                });
            });
        } catch (error) {
            return next(error);
        }
        /*    try {
         var query = "INSERT INTO ??(??,??,??,??,??,??) VALUES (?,?,?,?,?,?)";
         var table = ["Comments","title", "comment","rating","author","application","date",
         req.body.title, req.body.comment, req.body.rating, req.body.author, req.body.application,
         (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ')];
         query = mysql.format(query,table);
         req.app.locals.connection.query(query,function(err,rows){
         if(err) {
         return next(req.app.getError(500, "Internal error width database", err));
         } else {
         res.status(200).json({status: 200, message: "OK", data: {}});
         }
         });
         }
         catch (error) {
         return next(error);
         }*/
    }
);

router.put("/:idApp/comments/:idComment",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next) {
        if (req.user.id == null || req.user.id == undefined) return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        if ((req.body.title != undefined && req.body.title == "") ||
            (req.body.comment != undefined && req.body.comment == ""))
            return next(req.app.getError(404, "Bad request: one or multiple parameters missing.", null));
        try {
            req.app.get('mongoose').model('users').findOne({_id: req.user.id}, function (err, user) {
                if (err) return next(err);
                else if (user == null || user == undefined) return next(req.app.getError(403, "Unauthorized : invalid token", null));
                else {
                    req.user.admin = user.admin;
                    req.app.get('mongoose').model('applications').findOne({_id: req.params.idApp}, function (err, app) {
                        if (err) return next(err);
                        else if (app == null || app == undefined) return next(req.app.getError(404, "Not found : invalid application id", null));
                        else next();
                    });
                }
            });
        } catch (error) {
            return next(error);
        }
    },
    function(req,res, next) {
        try {
            req.app.get('mongoose').model('comments').findOne({id: req.params.idComment, application: req.params.idApp}, function (err, comment) {
                if (err) return next(err);
                else if (comment == null || comment == undefined) return next(req.app.getError(404, "Not found: comment not accessible or not found"), null);
                else {
                   if (comment.author == req.user.id || req.user.admin == true) {
                        for (var key in req.body) {
                            if (comment[key] != undefined)
                                comment[key] = req.body[key];
                        }
                       comment.save(function(err) {
                           if (err) return next(err);
                           else res.status(200).json({
                               status       : 200,
                               message      : "Comment successfully modified",
                               data         : {}
                           });
                       });
                   }
                }
            });
        }
        catch (error) {
            return next(error);
        }
        /*  try {
         var query = "DELETE from ?? WHERE ??=?";
         var table = ["Comments","idComment",req.params.idComment];
         query = mysql.format(query,table);
         req.app.locals.connection.query(query,function(err,rows){
         if(err) {
         return next(req.app.getError(500, "Internal error width database", err));
         } else {
         res.status(200).json({status: 200, message: "OK", data: {}});
         }
         });
         }
         catch (error) {
         return next(error);
         }*/
    }
);

module.exports = router;