/**
 * Created by kersal_e on 16/06/2016.
 */

var express = require('express');
var router = express.Router();
var expressjwt = require('express-jwt');
var Applications = require('../../models/applications');
var Validation = require('../../models/validation');
var Comments = require('../../models/comments');
var Purchase = require('../../models/purchase');
var permissions = require('../permissions');
var ObjectId = require('mongoose').Types.ObjectId;
var multer = require('multer');
var uploadPictures = multer({ dest: '/home/API/uploads/pictures/'});
var uploadApplications = multer({ dest: '/home/API/uploads/applications/'});
var fs = require("fs");
var Users = require('../../models/users');
var braintree = require("braintree");

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

function depileApplications(applications, next) {
    if (applications.length <= 0) {
        return next();
    }
    Comments.aggregate(
        [
            {$match: {application:  applications[applications.length - 1]._id}},
            {
                $group: {
                    _id: applications[applications.length - 1].id,
                    average: {$avg: "$rating"},
                    count: {$sum: 1}
                }
            }
        ],
        function (err, result) {
            Applications.findOne({_id: (result.length > 0) ? ObjectId(result[0]._id) : 0 }, function (err, res) {
                if (res != null && res != undefined) {
                    res.noteAvg = result[0].average;
                    res.commentsNb = result[0].count;
                    res.save(function(err) {
                        if (err) console.log(err);
                        applications.pop();
                        depileApplications(applications, next);
                    });
                }
                else {
                    applications.pop();
                    depileApplications(applications, next);
                }
            });
        }
    );
}

router.get("/",
    permissions(["all"]),
    function(req, res, next) {
        Applications.find(function(err, applications) {
            if (err) return next();
            else if (applications == null || applications == undefined) return next();
            else {
                depileApplications(applications, next);
            }
        });
    },
    function(req, res, next) {
        try {
            var query = {};
            var schema = {
                name            : "",
                categoriesName  : [],
                devicesNames    : [],
                author          : ""
            };
            for (var key in req.query) {
                if (req.query[key] != undefined && schema[key] != undefined) {
                    if ((key == "categoriesName" || key == "devicesName") && Array.isArray(req.query[key]))
                        query[key] = req.query[key];
                    else
                        query[key] = req.query[key];
                }
            }
            Applications.find(query).populate("author", "public").populate("devicesName").populate("categoriesName").exec(function(err, applications) {
                if (err) return next(err);
                else {
                    return res.status(200).json({
                        status: 200,
                        message: "OK",
                        data: (applications == undefined || applications == null) ? {count: 0} : {
                            count: applications.length,
                            application: applications
                        }
                    });
                }
            });
        }
        catch (error) {
            return next(error);
        }
    }
);

router.get("/purchase",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin"]),
    function(req, res, next) {
        try {
            Purchase.find().exec(function(err, purchases) {
                if (err) return next(err);
                else {
                    res.status(200).json({
                        status: 200,
                        message: "OK",
                        data: {
                            purchases: purchases
                        }
                    });
                }
            });
        } catch (error) {
            return next(error);
        }
    }
);

router.get("/:idApplication/purchase",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["all"]),
    function(req, res, next) {
        try {
            Purchase.find({application: req.params.idApplication}, function(err, purchases) {
                if (err) return next(err);
                else {
                    return res.status(200).json({
                        status: 200,
                        message: "OK",
                        data: {
                            count : purchases.length,
                            purchase: purchases,
                            app: req.params.idApplication
                        }
                    });
                }
            })
        } catch (error) {
            return next(error);
        }
    }
);

/* GET /applications/pending
 * Retourne la liste des applications en attente de validation
 * Si admin renvoie toute la liste
 * Si user renvoie ses applications déposées en attente de validation
 * */
router.get("/pending",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "logged"]),
    function(req, res, next) {
        try {
            if (req.user.admin == true) {
                Validation.find({type: 'application'}).
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
                Validation.find({type: 'application', author: req.user.id}).
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
    }
);

/* POST /applications/pending/:idApp/validate
 * Publie une application en attente de validation
 * */
router.get("/pending/:idApp/validate",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin"]),
    function(req, res, next) {
        try {
            Validation.findOne({_id : new ObjectId(req.params.idApp), type: 'application'}, function(err, application) {
                if (err) return next(err);
                else if (application == null || application == undefined) return next(req.app.getError(404, "Not found : verify id match with pending application", null));
                else {
                    var newApplication = new Applications();
                    newApplication.author = application.application.author;
                    newApplication.name = application.application.name;
                    newApplication.description = application.application.description;
                    newApplication.logo = application.application.logo;
                    newApplication.screenshots = application.application.screenshots;
                    newApplication.url = application.application.url;
                    newApplication.categoriesName = application.application.categoriesName;
                    newApplication.devicesName = application.application.devicesNames;
                    newApplication.price = application.application.price;
                    newApplication.save(function(err) {
                        if (err) {
                            return next(err);
                        }
                        else {
                            res.status(200).json({
                                status          : 200,
                                message         : "OK",
                                data            : {}
                            });
                            application.remove();
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
    permissions(["admin", "logged"]),
    function(req, res, next) {
        try {
            Validation.findOne({ id : req.params.idApp }, function(err, app) {
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
    permissions(["admin"]),
    function(req, res, next) {
        try {
            Validation.findOne({id : req.params.idApp, type: 'application'}, function(err, application) {
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
router.get("/:idApplication",
    permissions(["all"]),
    function(req, res, next) {
        Applications.find(function(err, applications) {
            if (err) return next();
            else if (applications == null || applications == undefined) return next();
            else {
                depileApplications(applications, next);
            }
        });
    },
    function(req, res, next) {
        try {
            Applications.findOne({ _id : new ObjectId(req.params.idApplication) }).populate("author", "public").populate("devicesName").populate("categoriesName").exec(function(err, app) {
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
    }
);

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
    permissions(["admin", "logged"]),
    function(req, res, next) {
        try {
            Applications.findOne({id: req.params.idApplication}, function (err, app) {
                if (err) return next(err);
                else if (req.user.admin == true || req.user.id == app.author) {
                    app.remove(function (err) {
                        if (err) return next(err);
                        else res.status(200).json({
                            status: 200,
                            message: "Successfully deleted",
                            data: {}
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
    }
);

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
    permissions(["admin", "Developer"]),
    function(req, res, next) {
        Applications.findOne({name: req.body.name}, function(err, app) {
            if (err || !app) return next();
            else return next(req.app.getError(409, "Application name already used"));
        });
    },
    function(req,res, next) {
        console.log(req.body);
        if (req.body.name == undefined || req.body.name == ""||
            req.body.description == undefined || req.body.description == "" ||
            req.body.price == undefined || req.body.price == "" ||
            req.body.logo == undefined || req.body.logo == "" ||
            req.body.url == undefined || req.body.url == "" ||
            req.body.devices == undefined || req.body.devices.length == 0 ||
            req.body.categories == undefined || req.body.categories.length == 0  )
            return next(req.app.getError(400, "Bad request : incorrect or missing parameters", null));
        try {
            var newValidationApp = new Validation();
            newValidationApp.type = "application";
            newValidationApp.application = {};
            newValidationApp.application.name = req.body.name;
            newValidationApp.application.description = req.body.description;
            newValidationApp.application.logo= req.body.logo;
            newValidationApp.application.screenshots = (req.body["screenshots"] != undefined) ? req.body.screenshots : [];
            newValidationApp.application.url = req.body.url;
            newValidationApp.application.categoriesName = req.body.categories;
            newValidationApp.application.devicesNames = req.body.devices;
            newValidationApp.application.author = req.user.id;
            newValidationApp.application.price = req.body.price;
            newValidationApp.save(function(err) {
                if (err) return next(req.app.getError(409, "Conflicts, resources already existing.", err));
                else return res.status(200).json({
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
    }
);

var multiparty = require('multiparty');


router.post("/upload/screens",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "Developer"]),
    uploadPictures.array('screens', 3),
    function(req, res, next) {
        var files = [];
        for (var i = 0; i < req.files.length; ++i) {
            files.push("http://beavr.fr:3000/api/uploads/pictures/" + req.files[i].filename + ".png");
            fs.rename(req.files[i].path, req.files[i].path + ".png", function (err) {
                if (err)
                    return next(err);
            });
        }
        return res.status(200).json({
            status      : 200,
            message     : "OK",
            data        : {
                count   : files.length,
                screens : files
            }
        });
    }
);

router.delete("/upload/screens/:filename",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin"]),
    function(req, res, next) {
        if (fs.existsSync("/home/API/uploads/pictures/" + req.params.filename)) {
            fs.unlink("/home/API/uploads/pictures/" + req.params.filename, function(err) {
                if (err) return next(err);
                else return res.status(200).json({
                    status      : 200,
                    message     : "OK"
                });
            });
        }
        else return next(req.app.getError(404, "File not found", null));
    }
);

router.post("/uploads/applications",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "Developer"]),
    uploadApplications.single("file"),
    function(req, res, next) {
        fs.rename(req.file.path, req.file.path + ".zip", function (err) {
            if (err)
                return next(err);
            else {
                return res.status(200).json({
                    status      : 200,
                    message     : "OK",
                    data        : {
                        source  : "http://beavr.fr:3000/api/uploads/applications/" + req.file.filename + ".zip"
                    }
                });
            }
        });
    }
);

router.delete("/uploads/applications/:applicationName",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin"]),
    function(req, res, next) {
        if (fs.existsSync("/home/API/uploads/applications/" + req.params.applicationName)) {
            fs.unlink("/home/API/uploads/applications/" + req.params.applicationName, function(err) {
                if (err) return next(err);
                else return res.status(200).json({
                    status      : 200,
                    message     : "OK"
                });
            });
        }
        else return next(req.app.getError(404, "File not found", null));
    }
);

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
    permissions(["admin", "Developer"]),
    function(req, res, next) {
        try {
            if (req.user.admin == true) {
                Applications.findOne({_id: new ObjectId(req.params.idApplication) }, function(err, application) {
                    if (err) return next(err);
                    else if (res == null || res == undefined) return next(req.app.getError(404, "Not found: please verify that application really exist"));
                    else {
                        for (var key in req.body) {
                            if (application[key] != undefined)
                                application[key] = req.body[key];
                        }
                        application.save(function(err) {
                            if (err) return next(err);
                            else return res.status(200).json({
                                status          : 200,
                                message         : "OK",
                                data            : {
                                    application : application
                                }
                            });
                        });
                    }
                });
            }
            else {
                Applications.findOne({_id: new ObjectId(req.params.idApplication), author : req.user.id}, function(err, application) {
                    if (err) return next(err);
                    else if (application == null || application == undefined) return next(req.app.getError(404, "Not found: please verify that application belongs to current user"));
                    else {
                        for (var key in req.body) {
                            if (application[key] != undefined)
                                application[key] = req.body[key];
                        }
                        application.save(function(err) {
                            if (err) return next(err);
                            else return res.status(200).json({
                                status          : 200,
                                message         : "OK",
                                data            : {
                                    application : application
                                }
                            });
                        });
                    }
                });
            }
        } catch (error) {
            return next(error);
        }
    }
);

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
    permissions(["all"]),
    function(req, res, next) {
        try {
            Applications.findOne({_id : new ObjectId(req.params.idApp)}, function(err, app) {
                if (err) return next(err);
                else if (app == null || app == undefined) return next(req.app.getError(404, "Not found: application unknown", null));
                else next();
            });
        }  catch (error) {
            return next(error);
        }
    },
    function(req,res, next) {
        try {
            Comments.find({ application: new ObjectId(req.params.idApp) }).
            populate("author", "public").
            sort({created_at: (req.query["order"] && req.query["order"] == "ASC") ? 1 : -1}).
            limit((req.query["limit"] && isNaN(parseInt(req.query["limit"])) == false) ? parseInt(req.query["limit"]) : 999).
            exec(function(err, comments) {
                if (!err) {
                    res.status(200).json({
                        status: 200,
                        message: "OK",
                        data: {
                            count: (comments == undefined || comments == null) ? 0 : comments.length,
                            comments: (comments == undefined || comments == null) ? [] : comments
                        }
                    });
                } else return next(err);
            });
        } catch(error) {
            return next(error);
        }
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
    permissions(["admin"]),
    function(req, res, next) {
        try {
            Applications.findOne({id: req.params.idApp}, function (err, app) {
                if (err) return next(err);
                else if (app == null || app == undefined) return next(req.app.getError(404, "Not found : invalid application id", null));
                else next();
            });
        } catch (error) {
            return next(error);
        }
    },
    function(req,res, next) {
        try {
            Comments.findOne({id: req.params.idComment, application: req.params.idApp}, function (err, comment) {
                if (err) return next(err);
                else if (comment == null || comment == undefined) return next(req.app.getError(404, "Not found: comment not accessible or not found"), null);
                else {
                    comment.remove(function(err) {
                        if (err) return next(err);
                        else {
                            res.status(200).json({
                                status      : 200,
                                message     : "Successfully deleted",
                                data        : {}
                            });
                            Applications.find(function(err, res) {
                                if (!err) depileApplications(res, function() {return;});
                            });
                        }
                    });
                }
            })
        }
        catch (error) {
            return next(error);
        }
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
    permissions(["logged"]),
    function(req, res, next) {
        try {
            Applications.findOne({ _id :  ObjectId(req.params.idApp)}, function(err, app) {
                if (err) return next(err);
                else if (app == null || app == undefined) return next(req.app.getError(404, "Not found : invalid application id", null));
                else {
                    Comments.findOne({ author: req.user.id, application: req.params.idApp }, function(err, comment) {
                        if (err) return next(err);
                        else if (comment) return next(req.app.getError(409, "Conflict: user has already commented this app"), null);
                        else next();
                    })
                }
            });
        } catch (error) {
            return next(error);
        }
    },
    function(req,res, next) {
        if (req.body.title == undefined || req.body.title == "" ||
            req.body.comment == undefined || req.body.comment == "")
            return next(req.app.getError(404, "Bad request: one or multiple parameters missing.", null));
        try {
            var newComment = new Comments({
                title       : req.body.title,
                comment     : req.body.comment,
                rating      : req.body.rating,
                author      : req.user.id,
                application : req.params.idApp
            });

            newComment.save(function(err){
                if (err) return next(err);
                else {
                    res.status(200).json({
                        status      : 200,
                        message     : "OK",
                        data        : {}
                    });
                    Applications.find(function(err, res) {
                        if (!err) depileApplications(res, function() {return;});
                    });
                }
            });
        } catch (error) {
            return next(error);
        }
    }
);

router.put("/:idApp/comments/:idComment",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "logged"]),
    function(req, res, next) {
        try {
            Applications.findOne({id: req.params.idApp}, function (err, app) {
                if (err) return next(err);
                else if (app == null || app == undefined) return next(req.app.getError(404, "Not found : invalid application id", null));
                else next();
            });
        } catch (error) {
            return next(error);
        }
    },
    function(req,res, next) {
        try {
            Comments.findOne({id: req.params.idComment, application: req.params.idApp}, function (err, comment) {
                if (err) return next(err);
                else if (comment == null || comment == undefined) return next(req.app.getError(404, "Not found: comment not accessible or not found"), null);
                else {
                    if (comment.author == req.user.id || req.user.admin == true) {
                        for (var key in req.body) {
                            if (comment[key] != undefined && key != "_id" && key != "id" && req.body[key] != "")
                                comment[key] = req.body[key];
                        }
                        comment.save(function(err) {
                            if (err) return next(err);
                            else {
                                res.status(200).json({
                                    status       : 200,
                                    message      : "Comment successfully modified",
                                    data         : {}
                                });
                                Applications.find(function(err, res) {
                                    if (!err) depileApplications(res, function() {return;});
                                });
                            }
                        });
                    }
                }
            });
        }
        catch (error) {
            return next(error);
        }
    }
);

router.get('/:idApplication/free',
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["logged"]),
    function(req, res, next) {
        try {
            Applications.findOne({id: req.params.idApplication}, function (err, app) {
                if (err) return next(err);
                else if (app == null || app == undefined) return next(req.app.getError(404, "Not found : invalid application id", null));
                else {
                    if (app.price == "0") {
                        Users.findOne({id : req.user.id}, function(err, user) {
                            var purchase = new Purchase();
                            purchase.application = req.params.idApplication;
                            purchase.amount = 0;
                            purchase.payment = "none";
                            purchase.save(function(err) {
                                if (err) return next(err);
                                else {
                                    user.purchase.push(purchase._id);
                                }
                            });
                            user.applications.push(app._id);
                            user.save(function(err){
                                if (err) return next(err);
                                else return res.status(200).json({
                                    status      : 200,
                                    message     : "Application added",
                                    data        : {}
                                });
                            })
                        });
                    }
                    else {
                        return next(req.app.getError(402, "Payment needed", { route : "/api/applications/:idApplication/payment" }));
                    }
                }
            });
        } catch (error) {
            return next(error);
        }
    }
);

router.get('/:idApplication/payment',
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["logged"]),
    function(req, res, next) {
        try {
            Applications.findOne({id: req.params.idApplication}, function (err, app) {
                if (err) return next(err);
                else if (app == null || app == undefined) return next(req.app.getError(404, "Not found : invalid application id", null));
                else {
                        return req.app.get('gateway').clientToken.generate({}, function(err, response) {
                            if (err) return next(err);
                            else {
                                return res.status(200).json({
                                    status: 200,
                                    message: "OK",
                                    data: {
                                        clientToken : response.clientToken
                                    }
                                });
                            }
                        });
                    }
            });
        } catch (error) {
            return next(error);
        }
    }
);

router.post('/:idApplication/checkout',
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["logged"]),
    function(req, res, next) {
        var nonceFromTheClient = req.body.payment_method_nonce;
        Applications.findOne({ _id : new ObjectId(req.params.idApplication)}, function(err, app) {
            if (err) return next(err);
            else if (app == null || app == undefined) return next(req.app.getError(404, "Application not found."));
            else {
                Users.findOne({_id: new ObjectId(req.user.id)}, function(err, user) {
                    if (err) return next(err);
                    else if (user == undefined || user == null) return next(req.app.getError(404, "User not found"));
                    else {
                        req.app.get('gateway').transaction.sale({
                            amount: app.price,
                            paymentMethodNonce: nonceFromTheClient,
                            options: {
                                submitForSettlement: true
                            }
                        }, function(err, result) {
                            if (err) return next(err);
                            else {
                                if (result.success == true) {
                                    var purchase = new Purchase();
                                    purchase.application = req.params.idApplication;
                                    purchase.amount = result.transaction.amount;
                                    purchase.payment = result.transaction.paymentInstrumentType;
                                    purchase.transactionId = result.transaction.id;
                                        purchase.save(function(err) {
                                            if (err) return next(err);
                                            else {
                                                user.purchase.push(purchase._id);
                                            }
                                        });
                                    user.applications.push(app._id);
                                    user.save(function(err){
                                        if (err) return next(err);
                                        else return res.status(200).json({
                                            status      : 200,
                                            message     : "Application added",
                                            data        : {
                                                payment : result
                                            }
                                        });
                                    });
                                }
                                else {
                                    return next(req.app.getError(402, "Payment not completed.", result));
                                }
                            }
                        });
                    }
                });
            }
        });
    });



module.exports = router;