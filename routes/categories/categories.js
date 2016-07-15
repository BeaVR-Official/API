/**
 * Created by kersal_e on 16/06/2016.
 */

var express = require('express');
var router = express.Router();
var expressjwt = require('express-jwt');
var Users = require('../../models/users');
var Categories = require('../../models/categories');

/**
 * @api {get} /categoryTypes/ Liste des thèmes
 * @apiVersion 1.0.0
 * @apiName Liste des thèmes
 * @apiGroup Gestion Categories
 * @apiDescription Retourne la liste de tous les thèmes.
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object[]} Categories Liste des thèmes
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
*       "Error": false,
*       "Code" : 1,
*       "Categories": [
    *          {
    *           "idCategoryType": 1,
*           "description": "Sport"
    *          },
*          {
    *            "idCategoryType": 2,
    *            "description": "Sciences"
        *          },
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
router.get("/categoryTypes", function(req, res, next) {
    return next(req.app.getError(404, "Request deleted. Report to GET /api/categories ", null));
    /*    try {
     var query = "SELECT * FROM `CategoryTypes`";

     req.app.locals.connection.query(query, function(err, rows){
     if (!err)
     res.status(200).json({status: 200, message: "OK", data: {Categories:rows}});
     else
     return next(req.app.getError(500, "Internal error width database", err));
     });
     }
     catch (error) {
     return next(error);
     }*/
});

/**
 * @api {post} /categoryTypes Ajouter un thème
 * @apiVersion 1.0.0
 * @apiName Ajouter un thème
 * @apiGroup Gestion Categories
 * @apiDescription Ajouter un thème.
 *
 * @apiParam {String} description Nom du thème
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
router.post("/categoryTypes", function(req,res, next){
    return next(req.app.getError(404, "Request deleted. Report to POST /api/categories ", null));
    /*    try {
     var query = "INSERT INTO `CategoryTypes` (`description`) VALUES (?)";
     var table = [req.body.description];

     query = mysql.format(query,table);

     req.app.locals.connection.query(query,function(err,rows){
     if (!err)
     res.status(200).json({status: 200, message: "OK", data: {}});
     else
     return next(req.app.getError(500, "Internal error width database", err));
     });
     }
     catch (error) {
     return next(error);
     }*/
});

/**
 * @api {get} /categories/ Liste des catégories
 * @apiVersion 1.0.0
 * @apiName Liste des catégories
 * @apiGroup Gestion Categories
 * @apiDescription Retourne la liste de toutes les catégories.
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object[]} Categories Liste des catégories
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
*       "Error": false,
*       "Code" : 1,
*       "Categories": [
    *         {
    *           "idCategorie": 1,
*           "name": "Mathématique",
*           "description": "Les chiffres vous parlent ? ",
*           "type": 2
    *         },
*         {
    *           "idCategorie": 2,
    *           "name": "Géologie",
    *           "description": "Les pierres ça vous dit ",
    *           "type": 2
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
        if (req.query["name"] != undefined && req.query.name != "")
            Categories.findOne({name: req.query.name}, function(err, category) {
                if (err) return next(error);
                else res.status(200).json({
                    status          : 200,
                    message         : "OK",
                    data            : (category == undefined || category == null) ? {} : {
                        category    : category
                    }
                });
            });
        else
            Categories.
            find({}).
            sort({name: (req.query["order"] && req.query.order == "ASC") ? 1 : -1}).
            exec(function(err, categories) {
                if (err) return next(err);
                else res.status(200).json({
                    status          : 200,
                    message         : "OK",
                    data            : (categories == undefined || categories == null) ? {} : {
                        count       : categories.length,
                        categories  : categories
                    }
                })
            });
    } catch (error) {
        return next(error);
    }
    /*  try {
     var query = "SELECT * FROM `Categories`";

     req.app.locals.connection.query(query, function(err, rows){
     if (!err)
     res.status(200).json({status: 200, message: "OK", data: {Categories: rows}});
     else
     return next(req.app.getError(500, "Internal error width database", err));
     });
     }
     catch (error) {
     return next(error);
     }*/
});

router.get("/:idCategory", function(req, res, next) {
    try {
        Categories.
        findOne({ id : req.params.idCategory}, function(err, category) {
            if (err) return next(err);
            else if (category == undefined || category == null)  return next(req.app.getError(404, "Not found : category unknown", null));
            else res.status(200).json({
                    status      : 200,
                    message     : "OK",
                    data        : {
                        category: category
                    }
                });
        });
    } catch (error) {
        return next(error);
    }
});

router.put("/:idCategory",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next){
        if (req.user.id == null || req.user.id == undefined) return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        if (req.body.name == undefined || req.body.name == "" &&
            req.body.description == undefined || req.body.description == "")
            return next(req.app.getError(400, "Bad request: one or multiple parameters missing.", null));
        try {
            Users.findOne({id: req.user.id}, function (err, user) {
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
            Categories.findOne({ id : req.params.idCategory }, function(err, category) {
                if (err) return next(err);
                else if (category == null || category == undefined) return next(req.app.getError(404, "Not found : category unknown", null));
                else {
                    if (req.body.name != undefined && req.body.name != "")
                        category.name = req.body.name;
                    if (req.body.description != undefined && req.body.description != "")
                        category.description = req.body.description;
                    category.save(function(err) {
                        if (err) return next(err);
                        else res.status(200).json({
                            status      : 200,
                            message     : "OK",
                            data        : {
                                category: category
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

router.post("/",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next){
        if (req.user.id == null || req.user.id == undefined) return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        if (req.body.name == undefined || req.body.name == "" ||
            req.body.description == undefined || req.body.description == "")
            return next(req.app.getError(400, "Bad request: one or multiple parameters missing.", null));
        try {
            Users.findOne({id: req.user.id}, function (err, user) {
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
            var newCategory = Categories({
                name        : req.body.name,
                description : req.body.description
            });
            newCategory.save(function(err) {
                if (err) return next(err);
                else {
                    res.status(200).json({
                        status          : 200,
                        message         : "OK",
                        data            : {
                            category   : newCategory
                        }
                    })
                }
            })
        } catch (error) {
            return next(error);
        }
    }
);

/**
 * @api {get} /categories/:idType Récupérer les catégories d'un thème
 * @apiVersion 1.0.0
 * @apiName Récupérer les catégories d'un thème
 * @apiGroup Gestion Categories
 * @apiDescription Retourne la liste de toutes les catégories pour un thème donné.
 *
 * @apiParam {Number} type ID du thème
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object[]} Categories Liste des catégories
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
*       "Error": false,
*       "Code" : 1,
*       "Categories": [
    *         {
    *           "idCategorie": 1,
*           "name": "Mathématique",
*           "description": "Les chiffres vous parlent ? ",
*           "type": 2
    *         },
*         {
    *           "idCategorie": 2,
    *           "name": "Géologie",
    *           "description": "Les pierres ça vous dit ",
    *           "type": 2
        *         },
*         ...
*       ]
*     }
 *
 * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
 * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = Le thème n'existe pas)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
*       "Error" : true,
*       "Code" : 102
    *     }
 *
 */
router.get("/:idType", function(req, res, next) {
    return next(req.app.getError(404, "Request deleted.", null));
    /*  try {
     var query = "SELECT * FROM `Categories` WHERE ??=?";
     var table = ["type", req.params.idType];
     query = mysql.format(query, table);
     req.app.locals.connection.query(query, function(err, rows){
     if (!err)
     {
     if (rows.length == 0)
     return next(req.app.getError(404, "Category not found", null)); // <---- Should be modified
     else
     res.status(200).json({status: 200, message: "OK", data: {Categories: rows}});
     }
     else
     return next(req.app.getError(500, "Internal error width database", err));
     });
     }
     catch (error) {
     return next(error);
     }*/
});

/**
 * @api {get} /categorytypesanddevices Récupérer les thèmes et les devices
 * @apiVersion 1.0.0
 * @apiName Récupérer les thèmes et les devices
 * @apiGroup Gestion Categories
 * @apiDescription Retourne la liste de tout les thèmes et de tout les devices.
 *
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object} Categories Liste des thèmes et des devices
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
*       "Error": false,
*       "Code" : 1,
*       "CategoryTypesAndDevices": {
    *             "CategoryTypes": "Toutes, Sciences, Sports, Mécanique",
    *             "Devices": "Leap Motion, Oculus Rift, HTC Vive, Samsung VR, HoloLens, Project Morpheus"
        *        }
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
router.get("/categorytypesanddevices", function(req, res, next) {
    return next(req.app.getError(404, "Request deleted. Report to GET /api/categories && GET /api/devices", null));
    /*    try {
            var query = "SELECT * FROM `AllCategoryTypesAndDevices`";

            req.app.locals.connection.query(query, function(err, rows){
                if (!err)
                    res.status(200).json({status: 200, message: "OK", data: {CategoryTypesAndDevices: rows[0]}});
                else
                    return next(req.app.getError(500, "Internal error width database", err));
            });
        }
        catch (error) {
            return next(error);
        }*/
});

module.exports = router;