/**
 * Created by kersal_e on 16/06/2016.
 */

var mysql = require("mysql");
var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

/**
* @api {get} /comments/ Liste des commentaires
* @apiVersion 1.0.0
* @apiName Liste des commentaires
* @apiGroup Gestion Commentaires
* @apiDescription Retourne la liste de toutes les commentaires.
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
*           "id": 1,
*           "comment": "lorem impsu",
*           "rating": "5",
*           "author": Jean Dujardin,
*           "application": "1",
*           "applicationName" : "Superbe app"
*           "date": "2016-04-15 03:48:32",
*           "title": "j'adore",
*           "pseudo": "JeanDu",
*           "email": "jeandujardin@gmail.com"
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
    var query = "SELECT * FROM ??";
    var table = ["AllCommentsInfos"];

    query = mysql.format(query, table);
    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
            res.json({"Error": false, "Code" : 1, "Comments": rows}); // OK
        else
            res.json({"Error": true, "Code" : 102}); // Erreur
    });
});

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
router.post("/:idApp",function(req,res){
    var query = "INSERT INTO ??(??,??,??,??,??,??) VALUES (?,?,?,?,?,?)";
    var table = ["Comments","title", "comment","rating","author","application","date",
        req.body.title, req.body.comment, req.body.rating, req.body.author, req.body.application,
        (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ')];
    query = mysql.format(query,table);
    req.app.locals.connection.query(query,function(err,rows){
        if(err) {
            res.json({"Error" : true, "Code" : 102});
        } else {
            res.json({"Error" : false, "Code" : 1});
        }
    });
});

router.put("/:idComment", function(req, res){

    var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
    var table = ["Comments", "title", req.body.title, "comment", req.body.comment, "rating", req.body.rating, "idComment", req.params.idComment];

    query = mysql.format(query, table);
    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
            res.json({"Error" : false, "Code" : 1}); // OK
        else
            res.json({"Error" : true, "Code" : 102}); // Error
    });
});


/**
* @api {get} /comments/:idApp Liste des commentaires d'une application
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

router.get("/:idApp",function(req,res){
    var query = "SELECT * FROM `AllCommentsInfos` WHERE ??=? ORDER BY date DESC";
    var table = ["application",req.params.idApp];
    
    query = mysql.format(query,table);
    req.app.locals.connection.query(query,function(err,rows){
        if(err) {
            res.json({"Error" : true, "Code" : 102});
        } else {
            res.json({"Error" : false, "Code" : 1, "Comments" : rows});
        }
    });
});

router.get("/:idApp/:limit",function(req,res){
    var query = "SELECT * FROM `AllCommentsInfos` WHERE ??=? ORDER BY date DESC LIMIT ?";
    var table = ["application",req.params.idApp, parseInt(req.params.limit)];
    
    query = mysql.format(query,table);
    req.app.locals.connection.query(query,function(err,rows){
        if(err) {
            res.json({"Error" : true, "Code" : 102});
        } else {
            res.json({"Error" : false, "Code" : 1, "Comments" : rows});
        }
    });
});

/**
* @api {post} /hasCommented Vérifier si un utilisateur a déjà commenté une application
* @apiVersion 1.0.0
* @apiName Vérifier si un utilisateur a déjà commenté une application
* @apiGroup Gestion Commentaires
* @apiDescription Permet de vérifier si un utilisateur a déjà commenté une application ou non.
*
* @apiParam {Number} idApplication ID de l'application
* @apiParam {Number} idAuthor ID de l'auteur
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
* @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'utilisateur n'existe pas)
*
* @apiErrorExample Erreur - Réponse :
*     {
*       "Error" : true,
*       "Code" : 102
    *     }
*
*/
router.post("/hasCommented/:idApp", function(req,res){
    var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
    var table = ["Comments","application",req.params.idApp,"author",req.body.idAuthor];
    query = mysql.format(query,table);
    req.app.locals.connection.query(query,function(err,rows){
        if(err) {
            res.json({"Error" : true, "Code" : 102});
        } else {
            if (rows.length == 0)
                res.json({"Error" : true, "Code" : 103}); // N'existe pas
            else
                res.json({"Error" : false, "Code" : 1, "Comment" : rows[0]}); // OK
        }
    });
});

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
router.delete("/:idApp/:idComment",function(req,res){
    var query = "DELETE from ?? WHERE ??=?";
    var table = ["Comments","idComment",req.params.idComment];
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