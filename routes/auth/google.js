/**
 * Created by kersal_e on 13/07/2016.
 */

var jwt = require('jsonwebtoken');

module.exports = function(app, passport) {

    app.get('/auth/google/logSuccess',
        isLoggedIn,
        function(req, res, next) {
            try {
                var token = jwt.sign({id : req.user.id}, process.env.jwtSecretKey);
                res.status(200).json({
                    status      : 200,
                    message     : "OK",
                    data        : {
                        token   : token
                    }
                });
            } catch (error) {
                next(error);
            }
        });

    app.get('/auth/google/logFailed', function(req, res, next) {
        next(req.app.getError(401, "Unauthorized: authentication failed", null));
    });
    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google/', passport.authenticate('google', { scope : ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/auth/google/logSuccess',
            failureRedirect : '/auth/google/logFailed',
        }));

};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    next(req.app.getError(401, "Unauthorized: authentication failed", null));
}