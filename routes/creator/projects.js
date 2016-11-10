/**
 * Created by kersal_e on 10/09/2016.
 */

var express = require('express');
var router = express.Router();
var expressjwt = require('express-jwt');
var permissions = require("../permissions");
var Projects = require("../../models/projects");
var fs = require("fs");
var multer = require('multer');
var uploadApplications = multer({ dest: '/home/API/uploads/creator/'});


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
);

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
        Users.findOne({_id: req.user.id}, function(err, user) {
            if (err) return next(err);
            else if (!user) return next(req.app.getError(404, "Invalid token please try log yourself again."))
            else {
                user.projects.delete(user.projects.find(req.params.idProject));
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

router.post("/uploads/projects",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
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
                        source  : "http://beavr.fr:3000/api/uploads/creator/" + req.file.filename + ".zip"
                    }
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
            else {
                Users.findOne({_id: req.params.idUser}, function(err, user) {
                    if (err) return next(err);
                    else if (!user) return next(req.app.getError(404, "User not found"));
                    else {
                        user.projects.push(project._id);
                        return res.status(200).json({
                            status      : 200,
                            message     : "OK",
                            data        : {
                                project : project
                            }
                        });
                    }
                });
            }
        });
    }
);

router.get('/:idUser/projects',
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        Users.findOne({_id: req.params.idUser})
            .populate("projects")
            .exec(function(err, user) {
                if (err) return next(err);
                else if (!user) return next(req.app.getError(404, "User not found"));
                else {
                    return res.status(200).json({
                        status  : 200,
                        message : "OK",
                        data    : {
                            projects: user.projects
                        }
                    })
                }
        });
    }
);

router.delete("/uploads/projects/:applicationName",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin"]),
    function(req, res, next) {
        if (fs.existsSync("/home/API/uploads/creator/" + req.params.applicationName)) {
            fs.unlink("/home/API/uploads/creator/" + req.params.applicationName, function(err) {
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

module.exports = router;
