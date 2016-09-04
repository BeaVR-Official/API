/**
 * Created by kersal_e on 16/06/2016.
 */

var express = require('express');
var router = express.Router();
var expressjwt = require('express-jwt');
var Devices = require('../../models/devices');
var permissions = require("../permissions");
var fs = require("fs");

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
    permissions(["all"]),
    function(req, res, next) {
        try {
            Devices.find({}, function(err, devices) {
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
    permissions(["all"]),
    function(req, res, next) {
        try {
            Devices.find({id: req.params.idDevice}, function(err, device) {
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
    permissions(["admin"]),
    function(req, res, next){
        try {
            var device = new Devices({
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
    permissions(["admin"]),
    function(req, res, next){
        try {
            Devices.findOneAndRemove({id: req.params.idDevice}, function(err) {
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
    permissions(["admin"]),
    function(req, res, next){
        try {
            Devices.findOne({id: req.params.idDevice}, function(err, device) {
                if (err) return next(err);
                else if (device == undefined || device == null) return next(req.app.getError(404, "Not found: device unknown"), null);
                else {
                    for (var key in req.body) {
                        if (key == "picture" && req.body["picture"].buffer != undefined && req.body["picture"].filename != undefined) {
                            var filename = shortid.generate() + "." + req.body.picture.filename.split('.').pop();
                            var buff = new Buffer(req.body.picture.buffer
                                .replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
                            var path = "http://beavr.fr:3000/api/uploads/devices/";
                            var old = device.image.substring(path.length, device.image.length);
                            device.image = path + filename;
                            fs.writeFile('/home/API/uploads/devices/' + filename, buff, function (err) {
                                if (!err) {
                                    fs.exists('/home/API/uploads/devices/' + old, function (exists) {
                                        if (exists) {
                                            fs.unlink('/home/API/uploads/devices/' + old);
                                        }
                                    });
                                }
                                else {
                                    device.image = "https://d30y9cdsu7xlg0.cloudfront.net/png/16261-200.png";
                                }
                            });
                        }
                        else
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
        }
        catch (error) {
            return next(error);
        }
    }
);

module.exports = router;