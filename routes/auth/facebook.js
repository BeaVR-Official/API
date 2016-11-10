/**
 * Created by kersal_e on 13/07/2016.
 */

var jwt = require('jsonwebtoken');

module.exports = function(app, passport) {

    app.get('/auth/facebook/logSuccess',
        isLoggedIn,
        function(req, res, next) {
            try {
                var token = jwt.sign({id : req.user.id}, process.env.jwtSecretKey);
                return res.redirect('http://store.beavr.fr/#/logSuccess?token='+token + '&userID='+req.user.id);
               /* res.status(200).json({
                    status      : 200,
                    message     : "OK",
                    data        : {
                        token   : token
                    }
                });*/
            } catch (error) {
                next(error);
            }
        });

    app.get('/auth/facebook/logFailed', function(req, res, next) {
        return res.redirect("http://store.beavr.fr/#/logError?error='Unauthorized: authentication failed'");
    });
    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email', 'user_friends']}));

    // the callback after google has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/auth/facebook/logSuccess',
            failureRedirect : '/auth/facebook/logFailed'
        }));

};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    next(req.app.getError(401, "Unauthorized: authentication failed", null));
}