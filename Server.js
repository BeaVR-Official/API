var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var mongoose = require("mongoose");
var fs = require('fs');

process.env.NODE_ENV = "debug";


var config = require('config');
var app  = express();

var routes = require('./routes/routes');
var users = require("./routes/users/users");
var applications = require('./routes/applications/applications');
var devices = require('./routes/devices/devices');
var categories = require('./routes/categories/categories');
var comments = require('./routes/comments/comments');
var mongo_express = require('mongo-express/lib/middleware');
var mongo_express_config = require('./node_modules/mongo-express/config');


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use('/admin', mongo_express(mongo_express_config));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

mongoose.connect('mongodb://127.0.0.1/beavr');

app.set('mongoose', mongoose);

app.getError = function(status,message, err) {
    var error = new Error;
    error.message = message;
    error.status = status;
    error.error = err;
    return error;
};

fs.readdirSync(__dirname + '/models').forEach(function(filename) {
   if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename);
});

function REST(){
    var self = this;
    self.connectMysql();
}

REST.prototype.connectMysql = function() {
    var self = this;
    var pool = mysql.createPool({
        connectionLimit : process.env.dbConnectionLimit || 100000,
        host     : process.env.dbHost || '5.196.88.52',
        user     : process.env.dbUsername,
        password : process.env.dbPassword,
        port : process.env.dbPort || 3306,
        database : process.env.dbName,
        debug    :  false
    });

    pool.getConnection(function(err,connection){
        if(err) {
            //self.stop(err);
            console.log(err);
            //self.connectMysql(); //my modif
        } else {
            self.configureExpress(connection);
        }
    });
};

REST.prototype.configureExpress = function(connection) {
    var self = this;
    //app.use(bodyParser.urlencoded({ extended: true }));
    //app.use(bodyParser.json());
    app.locals.connection = connection;
    app.use('/api', routes);
    app.use('/api/users', users);
    app.use('/api/applications', applications);
    app.use('/api/devices', devices);
    app.use('/api/categories', categories);
    app.use('/api/comments', comments);

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

    app.use(function(err, req, res, next) {
        res.status(parseInt((err.status != undefined) ? err.status: 500)).json({
            message: err.message,
            error: err
        });
    });

    self.startServer();
};

REST.prototype.startServer = function() {
    app.listen(process.env.PORT || 3000,function(){
        var value = (process.env.PORT == undefined) ? 3000 : process.env.PORT;
        console.log("All right ! I'm using port " + value  + ".");
    });
};

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL \n" + err);
    //process.exit(1);
    self.connectMysql();//my modifes
};

new REST();
