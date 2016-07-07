/**
 * Created by kersal_e on 16/06/2016.
 */

var express = require('express');
var router = express.Router();
var expressjwt = require('express-jwt');

/**
 * @api {get} /devices/ Liste des devices
 * @apiVersion 1.0.0
 * @apiName Liste des devices
 * @apiGroup Gestion Devices
 * @apiDescription Retourne la liste de tous les devices (casques et gants de réalité virtuelle).
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object[]} Devices Liste des devices
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
*       "Error": false,
*       "Code" : 1,
*       "Devices": [
    *         {
    *           "idDevice": 1,
*           "name": "Leap Motion",
*           "image": "Lien vers l'image"
    *         },
*         {
    *           "idDevice": 2,
    *           "name": "Oculus Rift",
    *           "image": "Lien vers l'image"
        *         },
*         ...
*      ]
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
router.get("/",
    function(req, res, next) {
        try {
            req.app.get('mongoose').model('devices').find({}, function(err, devices) {
                if (err) return next(err);
                else res.status(200).json({
                    status      : 200,
                    message     : "OK",
                    data        : {
                        count   : (devices != undefined && devices != null) ? devices.length : 0,
                        devices : (devices != undefined && devices != null) ? devices : []
                    }
                })
            });
        } catch (error) {
            return next(error);
        }
        /*        try {
         var query = "SELECT * FROM `Devices`";

         req.app.locals.connection.query(query, function(err, rows){
         if (!err)
         res.status(200).json({status: 200, message: "OK", data: { Devices : rows}});
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
 * @api {get} /devices/:idDevice Récupérer les informations d'un device
 * @apiVersion 1.0.0
 * @apiName Récupérer les informations d'un device donné
 * @apiGroup Gestion Devices
 * @apiDescription Retourne les informations d'un device (casque ou gants de réalité virtuelle).
 *
 * @apiParam {Number} idDevice ID du device
 *
 * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
 * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
 * @apiSuccess (Succès) {Object} Devices Informations du device
 *
 * @apiSuccessExample Succès - Réponse :
 *     {
*       "Error": false,
*       "Code" : 1,
*       "Devices": {
    *           "idDevices": 1,
    *           "name": "Leap Motion",
    *           "image": "Lien vers l'image"
        *         },
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
router.get("/:idDevice",
    function(req, res, next) {
        try {
            req.app.get('mongoose').model('devices').find({_id: req.params.idDevice}, function(err, device) {
                if (err) return next(err);
                else if (device == null || device == undefined) return next(req.app.getError(404, "Not found: unknown device id"), null)
                else res.status(200).json({
                        status      : 200,
                        message     : "OK",
                        data        : {
                            device  : device
                        }
                    })
            });
        } catch (error) {
            return (error);
        }
        /* try {
         var query = "SELECT * FROM Devices WHERE ??=?";
         var table = ["idDevice", req.params.idDevice];


         query = mysql.format(query, table);
         req.app.locals.connection.query(query, function(err, rows){
         if (!err)
         {
         if (rows.length == 0)
         return next(req.app.getError(404, "Device not found", null));
         else
         res.status(200).json({status: 200, message: "OK", data: { Device : rows[0]}});
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
 * @api {post} /devices Ajouter un device
 * @apiVersion 1.0.0
 * @apiName Ajouter un device
 * @apiGroup Gestion Devices
 * @apiDescription Ajouter un device.
 *
 * @apiParam {Number} name Nom du device
 * @apiParam {String} image URL de l'image du device
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
router.post("/",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next) {
        if (req.user.id == "" || req.user.id == undefined)
            return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        if (req.body["name"] == undefined || req.body["name"] == "") {
            return next(req.app.getError(400, "Bad request : missing parameter name.", null));
        }
        try {
            req.app.get('mongoose').model('users').findOne({_id : req.user.id, admin : true}, function(err, user) {
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
            var device = new req.app.get('mongoose').model('devices')({
                name    : req.body.name,
                image   : (req.body['image'] != undefined) ? req.body.image : ""
            });
            device.save(function(err) {
                if (err) return next(err);
                else res.status(200).json({
                    status      : 200,
                    message     : "New device added",
                    data        : {
                        device  : device
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
 * @api {delete} /devices/:idDevice Supprimer un device
 * @apiVersion 1.0.0
 * @apiName Suppression d'un device
 * @apiGroup Gestion Devices
 * @apiDescription Supprimer un device.
 *
 * @apiParam {Number} idDevice ID du device
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
 * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = Le device n'existe pas)
 *
 * @apiErrorExample Erreur - Réponse :
 *     {
*       "Error" : true,
*       "Code" : 102
    *     }
 *
 */
router.delete("/:idDevice",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next) {
        if (req.user.id == "" || req.user.id == undefined)
            return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        try {
            req.app.get('mongoose').model('users').findOne({_id : req.user.id, admin : true}, function(err, user) {
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
            req.app.get('mongoose').model('devices').findOneAndRemove({_id: req.params.idDevice}, function(err) {
                if (err) return next(err);
                else res.status(200).json({
                    status  : 200,
                    message : "OK",
                    data    : {}
                });
            });
        }
        catch (error) {
            return next(error);
        }
    }
);

/**
 * @api {put} /devices/:idDevice Mettre à jour un device
 * @apiVersion 1.0.0
 * @apiName Mettre à jour un device
 * @apiGroup Gestion Devices
 * @apiDescription Permet de mettre à jour un device.
 *
 * @apiParam {String} name Nom du device
 * @apiParam {String} image Lien vers l'image
 * @apiParam {Number} idDevice ID du device
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
router.put("/:idDevice",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next) {
        if (req.user.id == "" || req.user.id == undefined)
            return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        try {
            req.app.get('mongoose').model('users').findOne({_id : req.user.id, admin : true}, function(err, user) {
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
            req.app.get('mongoose').model('devices').findOne({_id: req.params.idDevice}, function(err, device) {
                if (err) return next(err);
                else if (device == undefined || device == null) return next(req.app.getError(404, "Not found: device unknown"), null);
                else {
                    for (var key in req.body) {
                        device[key] = req.body[key];
                    }
                    device.save(function(err) {
                        if (err) return next(err);
                        else res.status(200).json({
                            status      : 200,
                            message     : "OK",
                            data        : {
                                device  : device
                            }
                        });
                    });
                }
            });
            /*        var query = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
             var table = ["Devices", "name", req.body.name, "image", req.body.image, "idDevice", req.params.idDevice];

             query = mysql.format(query, table);
             req.app.locals.connection.query(query, function(err, rows){
             if (!err)
             res.status(200).json({status: 200, message: "OK", data: {}});
             else
             return next(req.app.getError(500, "Internal error width database", err));
             });*/
        }
        catch (error) {
            return next(error);
        }
    }
);

module.exports = router;