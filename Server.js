var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var mongoose = require("mongoose");
var fs = require('fs');

process.env.mailHost = 'ssl0.ovh.net';
process.env.mailPassword = 'epitech2017';
process.env.mailPort = 465;
process.env.mailUser = 'contact@beavr.fr';
process.env.jwtSecretKey = 'XSVgtQ\;>1!\,z`\,xDA*zMzs|#\$Iku-`P(l9p.u/1IO][#wKs\cXS\ElxM~P{pw4J';
process.env.NODE_ENV = "debug";
process.on('uncaughtException', function (error) {
    console.log(error);
});

fs.readdirSync(__dirname + '/models').forEach(function(filename) {
 if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename);
 });

var config = require('config');
var app  = express();



var routes = require('./routes/routes');
var users = require("./routes/users/users");
var applications = require('./routes/applications/applications');
var devices = require('./routes/devices/devices');
var categories = require('./routes/categories/categories');
var comments = require('./routes/comments/comments');
var newsletter = require('./routes/newsletter/newsletter');
var creator = require('./routes/creator/projects');
var mongo_express = require('mongo-express/lib/middleware');
var mongo_express_config = require('./node_modules/mongo-express/config');
var passport = require('passport');
var morgan = require('morgan');
var braintree = require("braintree");

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "f9584skpwt8q27k5",
    publicKey: "vgpxt3krqdxxyxy9",
    privateKey: "923db149431faa749afed43e46e5c2fd"
});

app.set('gateway', gateway);

app.use(require("express-session")({
    secret: process.env.jwtSecretKey,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));


require("./config/passport")(passport);
require('./routes/auth/google')(app, passport);
require("./routes/auth/facebook")(app, passport);


app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use('/admin', mongo_express(mongo_express_config));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.getError = function(status,message, err) {
    var error = new Error;
    error.message = message;
    error.status = status;
    error.error = err;
    return error;
};


mongoose.connect('mongodb://127.0.0.1/beavr');

app.set('mongoose', mongoose);

app.use('/api/uploads/applications', express.static(__dirname + '/uploads/applications'));
app.use('/api/uploads/users', express.static(__dirname + '/uploads/users'));
app.use('/api/uploads/devices', express.static(__dirname + '/uploads/devices'));
app.use('/api/uploads/pictures', express.static(__dirname + '/uploads/pictures'));
app.use('/api/uploads/creator', express.static(__dirname + '/uploads/creator'));
app.use('/api', routes);
app.use('/api/users', users);
app.use('/api/applications', applications);
app.use('/api/devices', devices);
app.use('/api/categories', categories);
app.use('/api/comments', comments);
app.use('/api/newsletter', newsletter);
app.use('/api/creator', creator);

function setPathError () {
    app.get('*', function(req, res, next) {
        var err = new Error();
        err.message = "Not found.";
        err.status = 404;
        next(err);
    });

    app.post('*', function(req, res, next) {
        var err = new Error();
        err.message = "Not found.";
        err.status = 404;
        next(err);
    });

    app.put('*', function(req, res, next) {
        var err = new Error();
        err.message = "Not found.";
        err.status = 404;
        next(err);
    });

    app.delete('*', function(req, res, next) {
        var err = new Error();
        err.message = "Not found.";
        err.status = 404;
        next(err);
    });
}

setPathError();

app.use(function(err, req, res, next) {
    res.status(parseInt((err.status != undefined) ? err.status: 500)).json({
        message: err.message,
        error: err
    });
});

app.listen(process.env.PORT || 3000,function(){
    var value = (process.env.PORT == undefined) ? 3000 : process.env.PORT;
    console.log("All right ! I'm using port " + value  + ".");
});




