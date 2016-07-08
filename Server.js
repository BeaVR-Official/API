var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");

// Required to get the right configuration file under /config
process.env.NODE_ENV = "debug";


var config = require('config');
var app  = express();

var routes = require('./routes/routes');
var users = require("./routes/users/users");
var applications = require('./routes/applications/applications');
var devices = require('./routes/devices/devices');
var categories = require('./routes/categories/categories');
var comments = require('./routes/comments/comments');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

console.log("OK");

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
    self.startServer();
};

REST.prototype.startServer = function() {
    app.listen(process.env.PORT || 3000,function(){
        console.log("All right ! I'm using port 3000.");
    });
};

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL \n" + err);
    //process.exit(1);
    self.connectMysql();//my modifes
};

new REST();
