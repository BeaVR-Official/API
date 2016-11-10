/**
 * Created by kersal_e on 05/08/2016.
 */

var Users = require("../models/users");

var permissions = function(groups) {
    return function(req, res, next) {
        if (groups.indexOf("all") != -1)
            return next();
        if (req.user.id == null || req.user.id == undefined) return next(req.app.getError(403, "Forbidden : user needs to be logged.", null));
        try {
            console.log(groups);
            Users.findOne({id: req.user.id}).populate("rights").exec(function (err, user) {
                if (err) return next(err);
                else if (user == null || user == undefined) return next(req.app.getError(403, "Unauthorized : invalid token", null));
                else {
                    req.user.admin = false;
                    for (var i = 0; i < groups.length; ++i) {
                        console.log(groups);
                        if (groups[i] == "admin" && user.admin == true) {
                            req.user.admin = true;
                            req.user.group = "admin";
                            return next();
                        }
                        else if (groups[i] == "logged") {
                            req.user.group = "logged";
                            return next();
                        }
                        else if (groups[i] == "me") {
                            if (user.id == req.params.idUser) {
                                req.user.group = "me";
                                return next();
                            }
                        }
                        else if (groups[i] == "Developer" && user.rights.name == groups[i]) {
                            req.user.group = "Developer";
                            return next();
                        }
                        else {
                            if (groups[i] == user.rights.name) {
                                req.user.group = groups[i];
                                return next();
                            }
                        }
                    }
                    return next(req.app.getError(403, "Forbidden: you need one of these privileges :" + groups));
                }
            });
        } catch (error) {
            return next(error);
        }
    }
};

module.exports = permissions;