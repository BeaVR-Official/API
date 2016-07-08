/**
 * Created by kersal_e on 16/06/2016.
 */

var mysql = require("mysql");
var express = require('express');
var router = express.Router();
var sha1 = require('sha1');


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
* @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'application n'existe pas)
*
* @apiErrorExample Erreur - Réponse :
*     {
*       "Error" : true,
*       "Code" : 102
    *     }
*
*/
router.delete("/:idApplication", function(req, res){

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
* @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête)
*
* @apiErrorExample Erreur - Réponse :
*     {
*       "Error" : true,
*       "Code" : 102
*     }
*
*/
router.put("/:idApplication",function(req,res){
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
            res.json({"Error" : true, "Code" : 102});
        } else {
            res.json({"Error" : false, "Code" : 1});
        }
    });
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

module.exports = router;