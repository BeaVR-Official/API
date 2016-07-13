/**
 * Created by kersal_e on 16/06/2016.
 */

var mysql = require("mysql");
var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
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
router.get("/", function(req, res){
    var query = "SELECT * FROM `AllApplicationsInfos`";

    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
            res.json({"Error": false, "Code" : 1, "Applications": rows}); // OK
        else
            res.json({"Error": true, "Code" : 102}); // Erreur
    });
});

/**
* @api {get} /applications/states/ Liste des états
* @apiVersion 1.0.0
* @apiName Liste des applications
* @apiGroup Gestion Applications
* @apiDescription Retourne la liste de toutes les états d'application.
*
* @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
* @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
* @apiSuccess (Succès) {Object[]} States Liste des états
*
* @apiSuccessExample Succès - Réponse :
*     {
*       "Error": false,
*       "Code" : 1,
*       "States" : [
*         {
*           "id": "1",
*           "state": "Validée",
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
router.get("/states", function(req, res){
    var query = "SELECT * FROM ??";
    var table = ["States"];

    query = mysql.format(query, table);
    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
            res.json({"Error" : false, "Code" : 1, "States" : rows}); // OK
        else
            res.json({"Error" : true, "Code" : 102}); // Erreur
    });
});

/**
* @api {get} /applications/categories/ Liste des catégories
* @apiVersion 1.0.0
* @apiName Liste des applications
* @apiGroup Gestion Applications
* @apiDescription Retourne la liste de toutes les catégories d'application.
*
* @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
* @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
* @apiSuccess (Succès) {Object[]} States Liste des catégories
*
* @apiSuccessExample Succès - Réponse :
*     {
*       "Error": false,
*       "Code" : 1,
*       "States" : [
*         {
*           "idCategory": "1",
*           "name": "Mathématique",
*           "description": "Les chiffres vous parlent ?",
            type: 2
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
router.get("/categories", function(req, res){
    var query = "SELECT * FROM ??";
    var table = ["Categories"];

    query = mysql.format(query, table);
    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
            res.json({"Error" : false, "Code" : 1, "Categories" : rows}); // OK
        else
            res.json({"Error" : true, "Code" : 102}); // Erreur
    });
});

/**
* @api {get} /applications/devices/ Liste des devices
* @apiVersion 1.0.0
* @apiName Liste des applications
* @apiGroup Gestion Applications
* @apiDescription Retourne la liste de toutes les devices d'application.
*
* @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
* @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
* @apiSuccess (Succès) {Object[]} Devices Liste des devices
*
* @apiSuccessExample Succès - Réponse :
*     {
*       "Error": false,
*       "Code" : 1,
*       "States" : [
*         {
*           "idDevice": "1",
*           "name": "LeapMotion",
*           "image": "masuperleap.jpg"
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
router.get("/devices", function(req, res){
    var query = "SELECT * FROM ??";
    var table = ["Devices"];

    query = mysql.format(query, table);
    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
            res.json({"Error" : false, "Code" : 1, "Devices" : rows}); // OK
        else
            res.json({"Error" : true, "Code" : 102}); // Erreur
    });
});

/**
* @api {get} /applications/medias Liste des medias
* @apiVersion 1.0.0
* @apiName Liste des applications
* @apiGroup Gestion Applications
* @apiDescription Retourne la liste de toutes les medias d'application.
*
* @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
* @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
* @apiSuccess (Succès) {Object[]} Medias Liste des médias
>>>>>>> 4a6d4f3891c118f5bde86a3abc532cd2b1336428
*
* @apiSuccessExample Succès - Réponse :
*     {
*       "Error": false,
*       "Code" : 1,
*       "States" : [
*         {
*           "idDevice": "1",
*           "name": "LeapMotion",
*           "image": "masuperleap.jpg"
*       "Medias" : [
*         {
*           "idMedia": "1",
*           "title": "Logo",
*           "url": "monlogotop.jpg"
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

router.get("/medias", function(req, res){
    var query = "SELECT * FROM ??";
    var table = ["Medias"];

    query = mysql.format(query, table);
    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
            res.json({"Error" : false, "Code" : 1, "Medias" : rows}); // OK
        else
            res.json({"Error" : true, "Code" : 102}); // Erreur
    });
});

/*
* @api {get} /applications/state/:state Liste des application pour un état donné
* @apiVersion 1.0.0
* @apiName Liste des applications
* @apiGroup Gestion Applications
* @apiDescription Retourne la liste de toutes les applications pour un état donné
*
* @apiParam {Number} state Etat de l'application
*
* @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
* @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
* @apiSuccess (Succès) {Object[]} Devices Liste des devices
*/
router.get("/state/:state", function(req, res){

    var query = "SELECT * FROM `AllApplicationsInfos` WHERE ??=?";
    var table = ["state", req.params.state];

    query = mysql.format(query, table);
    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
        {
            if (rows.length == 0)
                res.json({"Error" : true, "Code" : 103}); // N'existe pas
            else {
                res.json({"Error" : false, "Code" : 1, "Applications" : rows}); // OK
            }
        }
        else
            res.json({"Error" : true, "Code" : 102}); // Erreur
    });
});


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
router.get("/:idApplication", function(req, res){

    var query = "SELECT * FROM `AllApplicationsInfos` WHERE ??=?";
    var table = ["id", req.params.idApplication];

    query = mysql.format(query, table);
    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
        {
            if (rows.length == 0)
                res.json({"Error" : true, "Code" : 103}); // N'existe pas
            else {
                res.json({"Error" : false, "Code" : 1, "Applications" : rows[0]}); // OK
            }
        }
        else
            res.json({"Error" : true, "Code" : 102}); // Erreur
    });
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
* @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'application n'existe pas, 105 = L'utilisateur n'a pas les droits)
*
* @apiErrorExample Erreur - Réponse :
*     {
*       "Error" : true,
*       "Code" : 102
    *     }
*
*/
router.delete("/:idApplication", expressjwt({secret: process.env.jwtSecretKey}),function(req, res){

    if (req.user.role == 'Administrator') {
        var query = "DELETE FROM ?? WHERE ??=?";
        var table = ["Applications", "idApplication", req.params.idApplication];

        query = mysql.format(query, table);
        req.app.locals.connection.query(query, function(err, rows){
            if (!err)
            {
                if (rows.affectedRows == 1)
                    res.json({"Error" : false, "Code" : 1}); // OK
                else {
                    res.json({"Error" : true, "Code" : 103}); // N'existe pas
                }
            }
            else
                res.json({"Error" : true, "Code" : 102}); // Erreur
        });
    } else {
        res.json({"Error": true, "Code" : 105}); // L'utilisateur n'a pas les droits
    }
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
router.post("/", function(req,res){

    var query = "INSERT INTO ??(??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    var table = ["Applications", "name", "description", "creationDate", "price", "creator", "url", "state", "logo",
        req.body.name, req.body.description, (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' '),
        req.body.price, req.body.creator, req.body.url, req.body.state, req.body.logo];

    query = mysql.format(query,table);

    req.app.locals.connection.query(query, function(err,rows){
        if (!err)
            res.json({"Error" : false, "Code" : 1}); // OK
        else
            res.json({"Error" : true, "Code" : 102}); // Erreur
    });
});

/**
* @api {get} /applications/:idApplication/progressions Récupérer la progression
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
router.get("/:idApplication/progressions", function(req, res){

    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = ["Progressions", "application", req.params.idApplication];

    query = mysql.format(query, table);
    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
        {
            if (rows.length == 0)
                res.json({"Error" : true, "Code" : 201}); // Aucune progression
            else
                res.json({"Error" : false, "Code" : 1, "Progression" : rows}); // OK
        }
        else
            res.json({"Error" : true, "Code" : 102}); // Erreur
    });
});

/**
* @api {put} /applications/:idApplication/progressions Mettre à jour la progression d'une application
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
router.put("/:idApplication/progressions", function(req, res){

    var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    var table = ["Progressions", "hashProgression" , req.body.hashProgression, "application", req.params.idApplication];

    query = mysql.format(query, table);
    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
            res.json({"Error" : false, "Code" : 1}); // OK
        else
            res.json({"Error" : true, "Code" : 102}); // Erreur
    });
});

/**
* @api {put} /applications/:idApplication/validateApplicationSubmission Valide une application soumise par un développeur
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
router.post("/:idApplication/validateApplicationSubmission",function(req,res){
    var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    var table = ["Applications","state","1","idApplication",req.params.idApplication];
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
* @api {put} /applications/:idApplication Modifier les informations d'une application
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
* @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 105 = L'utilisateur n'a pas les droits)
*
* @apiErrorExample Erreur - Réponse :
*     {
*       "Error" : true,
*       "Code" : 102
*     }
*
*/
router.put("/:idApplication", expressjwt({secret: process.env.jwtSecretKey}), function(req,res){
    if (req.user.role == 'Administrator') {
        var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = (SELECT idMedia FROM Medias WHERE url = ?), ?? = ?, ?? = (SELECT idState FROM States WHERE state = ?) WHERE ?? = ?";
        var table = ["Applications", "name", req.body.name,
            "description", req.body.description,
            "price", req.body.price,
            "logo", req.body.logo.name,
            "url", req.body.url,
            "state", req.body.state.name,
            "idApplication", req.params.idApplication];
        query = mysql.format(query,table);
        req.app.locals.connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Code" : 102});
            } else {
                var query = "DELETE FROM ?? WHERE ?? = ?";
                var table = ["CategoriesToApplications", "fk_idApplication", req.params.idApplication];
                query = mysql.format(query,table);
                req.app.locals.connection.query(query,function(err,rows){
                    if (!err) {
                        var categories = req.body.categoriesNames;
                        for (var i = 0; i < categories.length; i++) {
                            var query = "INSERT INTO ?? (??, ??) VALUES (?, (SELECT idCategory FROM Categories WHERE name = ?))";
                            var table = ["CategoriesToApplications", "fk_idApplication", "fk_idCategory", req.params.idApplication, categories[i].name];
                            query = mysql.format(query,table);
                            req.app.locals.connection.query(query);
                        }
                    }
                });
                var query = "DELETE FROM ?? WHERE ?? = ?";
                var table = ["DevicesToApplications", "fk_idApplication", req.params.idApplication];
                query = mysql.format(query,table);
                req.app.locals.connection.query(query,function(err,rows){
                    if (!err) {
                        var devices = req.body.devicesNames;
                        for (var i = 0; i < devices.length; i++) {
                            var query = "INSERT INTO ?? (??, ??) VALUES (?, (SELECT idDevice FROM Devices WHERE name = ?))";
                            var table = ["DevicesToApplications", "fk_idApplication", "fk_idDevice", req.params.idApplication, devices[i].name];
                            query = mysql.format(query,table);
                            req.app.locals.connection.query(query);
                        }
                    }
                });
                var query = "DELETE FROM ?? WHERE ?? = ?";
                var table = ["MediasToApplications", "fk_idApplication", req.params.idApplication];
                query = mysql.format(query,table);
                req.app.locals.connection.query(query,function(err,rows){
                    if (!err) {
                        var medias = req.body.screenshots;
                        for (var i = 0; i < medias.length; i++) {
                            var query = "INSERT INTO ?? (??, ??) VALUES (?, (SELECT idMedia FROM Medias WHERE url = ?))";
                            var table = ["MediasToApplications", "fk_idApplication", "fk_idMedia", req.params.idApplication, medias[i].name];
                            query = mysql.format(query,table);
                            req.app.locals.connection.query(query);
                        }
                    }
                });
                res.json({"Error" : false, "Code" : 1});
            }
        });
    } else {
        res.json({"Error": true, "Code" : 105}); // L'utilisateur n'a pas les droits
    }
});

/**
* @api {post} /applications/ Soumettre une application
* @apiVersion 1.0.0
* @apiName Soumettre une application
* @apiGroup Gestion Applications
* @apiDescription Soumettre une application
*
* @apiParam {String} name Nom de l'application
* @apiParam {String} description Description de l'application
* @apiParam {Date} creationdate Date de création
* @apiParam {Number} price Prix de l'application
* @apiParam {Number} headdevice ID du casque de réalité virtuelle
* @apiParam {Number} handsdevice ID des gants de réalité virtuelle
* @apiParam {Number} authord ID de l'auteur de l'application
* @apiParam {Number} category Catégorie dans laquelle est classée l'application
* @apiParam {String} appUrl URL de l'application
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
router.post("/",function(req,res){
    var query = "INSERT INTO ??(??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?)";
    var table = ["applications","name","description","creationdate","price","headdevice","handsdevice","state","author","category","url",
        req.body.name,req.body.description,req.body.creationdate,req.body.price,req.body.headdevice,req.body.handsdevice,"1",req.body.author,
        req.body.category,req.body.appUrl];
    query = mysql.format(query,table);
    req.app.locals.connection.query(query,function(err,rows){
        if(err) {
            res.json({"Error" : true, "Code" : 102});
        } else {
            res.json({"Error" : false, "Code" : 1});
        }
    });
});

router.post("/userHasTheApplication",function(req,res){

    var query = "SELECT * FROM ?? WHERE ?? = ?";
    var table = ["Purchases", "buyer", req.body.idUser];

    query = mysql.format(query,table);

    console.log(query);

    req.app.locals.connection.query(query,function(err,rows){
        if(err) {
            res.json({"Error" : true, "Code" : 102, "Message" : err}); //ERROR
        } else {

            console.log("lenght");
            console.log(rows.length);
            if (rows.length == 0)
              res.json({"Error" : false, "Code" : 1, "Message" : rows, "Canbuy" : true}); //OK the user can buy the application
            else
              res.json({"Error" : false, "Code" : 1, "Message" : rows, "Canbuy" : false}); //ERROR the user has already the application
        }
    });
});

router.post("/addToLibrary",function(req,res){

    var dateOftheDay = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()* 60000))).toISOString().slice(0, 19).replace('T', ' ');

    var query = "INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?)"
    var table = ["Purchases", "purchaseDate", "application", "retailer", "buyer", "price", "commission", "originalPrice", dateOftheDay,
    req.body.application, req.body.retailer, req.body.buyer, req.body.price, req.body.commission, req.body.originalPrice];

    query = mysql.format(query,table);

    console.log(query);
    req.app.locals.connection.query(query,function(err,rows){
        if(err) {
            res.json({"Error" : true, "Code" : 102, "Message" : err}); //ERROR
        } else {
            res.json({"Error" : false, "Code" : 1, "Message" : rows}); //OK
        }
    });
});

module.exports = router;
