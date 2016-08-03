/**
 * Created by kersal_e on 02/08/2016.
 */

var express = require('express');
var router = express.Router();
var expressjwt = require('express-jwt');
var Users = require('../../models/users');
var Followers = require('../../models/followers');

router.get("/followers",
    expressjwt({secret: process.env.jwtSecretKey}),
    function(req, res, next) {
        if (req.user.id == "" || req.user.id == undefined)
            return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        if (req.body["name"] == undefined || req.body["name"] == "") {
            return next(req.app.getError(400, "Bad request : missing parameter name.", null));
        }
        try {
            Users.findOne({id : req.user.id, admin : true}, function(err, user) {
                if (err) return next(err);
                else if (user == null || user == undefined) return next(req.app.getError(403, "Forbidden : user needs admin privileges.", null));
                else next();
            });
        } catch (error) {
            return next(error);
        }
    },
    function(req, res, next) {
        try{
            Followers.find(function(err, res) {
                if (err) return next(err);
                else res.status(200).json({
                    status          : 200,
                    message         : 'OK',
                    data            : {
                        length      : res.length,
                        registered  : res
                    }
                });
            });
        } catch (error) {
            return next(error);
        }
    }
);

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

router.post("/followers",
    function(req, res, next) {
        if (req.body == undefined || req.body['email'] == undefined || req.body['email'] == null || !validateEmail(req.body['email']))
            return next(req.app.getError(400, 'Bad request. Missing or malformed email.', null));
        Followers.findOne({email: req.body['email']}, function(err, follower) {
            if(err) return next(err);
            else if (follower == null || follower == undefined) next();
            else
                return res.status(200).json({
                    status      : 200,
                    message     : "Email already registered."
                });
        });
    },
    function(req, res, next) {
        try {
            var NewRegistered = new Followers({
                email       : req.body['email'],
                firstname   : (req.body['firstname'] != undefined) ? req.body['firstname'] : null,
                lastname    : (req.body['lastname'] != undefined) ? req.body['lastname'] : null
            });
            NewRegistered.save(function(err) {
                if (err) return next(err);
                else res.status(200).json({
                    status      : 200,
                    message     : "Email well registered"
                });
            });
        } catch (error) {
            return next(error);
        }
    });

router.delete("/followers:id", function(req, res, next) {
    try {
        Followers.findOneAndRemove({id: req.params.id}, function(err) {
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
});

module.exports = router;