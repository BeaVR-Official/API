/**
 * Created by kersal_e on 10/09/2016.
 */

var express = require('express');
var router = express.Router();
var expressjwt = require('express-jwt');
var permissions = require("../permissions");
var Projects = require("../../models/projects");
var fs = require("fs");

router.get("/projects",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin"]),
    function(req, res, next) {
        Projects.find({}).exec(function(err, projects) {
            if (err) return next(err);
            else return res.status(200).json({
                status       : 200,
                message      : "OK",
                data         : {
                    count    : projects.length,
                    projects : projects
                }
            });
        });
    }
);

router.get("/:idUser/projects",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        Projects.find({author: req.params.idUser}).exec(function(err, projects) {
            if (err) return next(err);
            else return res.status(200).json({
                status       : 200,
                message      : "OK",
                data         : {
                    count    : projects.length,
                    projects : projects
                }
            });
        });
    }
)

router.get("/projects/:idProject",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin"]),
    function(req, res, next) {
        Projects.findOne({id: req.params.idProject}, function(err, project) {
            if (err) return next(err);
            else if (project == undefined || project == null) return next(req.app.getError(404, "Project not found. Please verify project's id"));
            else return res.status(200).json({
                    status      : 200,
                    message     : "OK",
                    data        : {
                        project : project
                    }
                });
        });
    }
);

router.get("/:idUser/projects/:idProject",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        Projects.findOne({id: req.params.idProject, author: req.params.idUser}, function(err, project) {
            if (err) return next(err);
            else if (project == undefined || project == null) return next(req.app.getError(404, "Project not found. Please verify project's id"));
            else return res.status(200).json({
                    status      : 200,
                    message     : "OK",
                    data        : {
                        project : project
                    }
                });
        });
    }
);

router.delete("/projects/:idProject",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin"]),
    function(req, res, next) {
        // fs unlink here
        Projects.findAndRemove({id: req.params.idProject}, function(err) {
            if (err) return next(err);
            else {
                return res.status(200).json({
                    status      : 200,
                    message     : "Delete successful"
                });
            }
        });
    }
);

router.delete("/:idUser/projects/:idProject",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        Projects.findAndRemove({id: req.params.idProject, author: req.params.idUser}, function(err) {
            if (err) return next(err);
            else {
                return res.status(200).json({
                    status      : 200,
                    message     : "Delete successful"
                });
            }
        });
    }
);

router.post("/:idUser/projects",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        var project = new Projects();
        project.name = req.body.name;
        project.sources = req.body.path;
        project.author = req.params.idUser;
        project.save(function(err) {
            if (err) return next(err);
            else return res.status(200).json({
                status      : 200,
                message     : "OK",
                data        : {
                    project : project
                }
            });
        });
    }
);

router.put("/:idUser/projects/:idProject",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        Projects.findOne({id: req.params.idProject, author: req.params.idUser}, function(err, project) {
            if (err) return next(err);
            else if (project == undefined || project == null) return next(req.app.getError(404, "Project not found or not belonging to you."));
            else {
                for (key in req.body) {
                    if (key != "author" && key != "id") {
                        project[key] = req.body[key];
                    }
                }
                project.save(function(err) {
                    if (err) return next(err);
                    else res.status(200).json({
                        status      : 200,
                        message     : "OK",
                        data        : {
                            project : project
                        }
                    });
                });
            }
        });
    }
);