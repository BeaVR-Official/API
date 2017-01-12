/**
 * Created by kersal_e on 10/09/2016.
 */

var express = require('express');
var router = express.Router();
var expressjwt = require('express-jwt');
var permissions = require("../permissions");
var Projects = require("../../models/projects");
var fs = require("fs");
var fsextra = require("fs.extra");
var multer = require('multer');
var Saves = require("../../models/save");
var Files = require("../../models/files");

router.post("/:idUser/projects",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        var project = new Projects();
        project.name = req.body.name;
        project.description = (req.body.description != undefined) ? req.body.description : "";
        project.author = req.params.idUser;
        project.save(function(err) {
            var repos = '/home/API/uploads/creator/' + project.author + "/" + project._id;
            if (err) {
                if (fs.existsSync(repos)) {
                    fsextra.rmrfSync(repos);
                }
            }
            return (err) ? next(err): res.status(200).json({
                status      : 200,
                message     : "OK",
                data        : {
                    project : project
                }
            });
        });
    }
);

router.get("/:idUser/projects",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        Projects.find({author: req.params.idUser})
            .exec(function(err, projects) {
                return (err) ? next(err) : res.status(200).json({
                    status       : 200,
                    message      : "OK",
                    data         : {
                        projects : projects
                    }
                });
            });
    }
);

router.get("/:idUser/projects/:idProject",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        Projects.findOne({author: req.params.idUser, _id: req.params.idProject})
            .exec(function(err, project) {
                if (err) return next(err);
                else if (!project) return next(req.app.getError(404, "Project not found"));
                else res.status(200).json({
                        status       : 200,
                        message      : "OK",
                        data         : {
                            project  : project
                        }
                    });
            });
    }
);

router.put("/:idUser/projects/:idProject",
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        Projects.findOneAndUpdate({author: req.params.idUser, _id: req.params.idProject}, {name: req.body.name, description: req.body.description}, {upsert:true})
            .exec(function(err, doc) {
                if (err) return next(err);
                else if (!doc) return next(req.app.getError(404, "Project not found"));
                else {
                    return res.status(200).json({
                        status       : 200,
                        message      : "OK",
                        data         : {
                            project  : doc
                        }
                    });
                }
            });
    }
);

router.delete('/:idUser/projects/:idProject',
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        Projects.findOneAndRemove({author: req.params.idUser, _id: req.params.idProject})
            .exec(function(err, post) {
                post.remove();
                return (err) ? next(err) : res.status(200).json({
                    status          : 200,
                    message         : "Project deleted"
                });
            })
    }
);


router.post('/:idUser/projects/:idProject/save',
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        var save = new Saves();
        save.author = req.params.idUser;
        save.project = req.params.idProject;
        save.sceneDescriptors  = req.body.sceneDescriptors;
        save.startingSceneUuid = req.body.startingSceneUuid;
        save.save(function(err) {
            return (err) ? next(err) : res.status(200).json({
                status      : 200,
                message     : "Save created",
                data        : {
                    save    : save
                }
            });
        });
    }
);

router.get('/:idUser/projects/:idProject/save/:idSave',
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        Saves.findOne({_id: req.params.idSave, author: req.params.idUser, project: req.params.idProject})
            .exec(function(err, save) {
                if (err) return next(err);
                else if (!save) return next(req.app.getError(404, 'Not found for specified user'));
                else return res.status(200).json({
                        status      : 200,
                        message     : "OK",
                        data        : {
                            save    : save
                        }
                    });
            });
    }
);

router.get('/:idUser/projects/:idProject/save',
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        Saves.find({author: req.params.idUser, project: req.params.idProject }).
        exec(function(err, saves) {
            return (err) ? next(err): res.status(200).json({
                status      : 200,
                message     : "OK",
                data        : {
                    saves   : saves
                }
            })
        })
    }
);

router.delete('/:idUser/projects/:idProject/save/:idSave',
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        Saves.findOneAndRemove({author: req.params.idUser, project: req.params.idProject, _id: req.params.idSave})
            .exec(function(err, post) {
                console.log(post);
                post.remove();
                return (err) ? next(err) : res.status(200).json({
                    status      : 200,
                    message     : "Save deleted"
                });
            });
    }
);

var uploadFiles = multer({dest:  '/home/API/uploads/temp/'}) ;
router.post('/:idUser/projects/:idProject/save/:idSave/files',
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    uploadFiles.single('file'),
    function(req, res, next) {
        var files = new Files();
        files.absolutePath = '/home/API/uploads/creator/' + req.params.idUser + "/" + req.params.idProject + "/" + req.params.idSave + '/' + req.file.filename;
        files.relativePath = "http://beavr.fr:3000/api/uploads/creator/" + req.params.idUser + "/" + req.params.idProject + "/" + req.params.idSave + "/" + req.file.filename;
        files.author = req.params.idUser;
        files.filename = req.file.filename;
        files.saves = req.params.idSave;
        files.save(function(err) {
            if (err) return next(err);
            else {
                Saves.findOne({_id: req.params.idSave, author: req.params.idUser})
                    .exec(function(err, save) {
                        if (err) return next(err);
                        else if (!save) return next(req.app.getError(404, "Save does not exist"));
                        else {
                            save.files.push(files._id);
                            save.save();
                            return res.status(200).json({
                                status      : 200,
                                message     : "Saved",
                                data        : {
                                    file    : files
                                }
                            });
                        }
                    });
            }
        });
    }
);

router.get('/:idUser/projects/:idProject/save/:idSave/files',
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        Saves.findOne({_id: req.params.idSave, author: req.params.idUser})
            .populate("files")
            .exec(function(err, save) {
                if (err) return next(err);
                else if (!save) return next(404, "Save does not exist");
                else return res.status(200).json({
                        status       : 200,
                        message      : "OK",
                        data         : {
                            files    :  save.files
                        }
                    })
            });
    }
);


router.get('/:idUser/projects/:idProject/save/:idSave/files/:idFile',
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        Files.findOne({_id: req.params.idFile, author: req.params.idUser})
            .exec(function(err, file) {
                if (err) return next(err);
                else if (!file) return next(req.app.getError(404, "File not found"));
                else return res.status(200).json({
                        status      : 200,
                        message     : "OK",
                        data        : {
                            file    : file
                        }
                    });
            });
    }
);

router.delete('/:idUser/projects/:idProject/save/:idSave/files/:idFile',
    expressjwt({secret: process.env.jwtSecretKey}),
    permissions(["admin", "me"]),
    function(req, res, next) {
        Files.findOneAndRemove({_id: req.params.idFile, author: req.params.idUser})
            .exec(function(err, post) {
                post.remove();
                return (err) ? next(err) : res.status(200).json({
                    status       : 200,
                    message      : "File deleted"
                });
            });
    }
);

module.exports = router;
