/**
 * Created by kersal_e on 13/07/2016.
 */


// load all the things we need
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
// load up the user model
var User       = require('../models/users');
var mongoose = require('mongoose');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))
    // code for twitter (use('twitter', new TwitterStrategy))

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

            clientID        : configAuth.googleAuth.clientID,
            clientSecret    : configAuth.googleAuth.clientSecret,
            callbackURL     : configAuth.googleAuth.callbackURL

        },
        function(token, refreshToken, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            process.nextTick(function() {

                // try to find the user based on their google id
                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, user);
                    } else {
                        // if the user isnt in our database, create a new user
                        var newUser          = new User();

                        // set all of the relevant information
                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.pseudo = profile.displayName.split(" ")[0] + "_" + mongoose.Types.ObjectId();
                        newUser.google.email = profile.emails[0].value; // pull the first email
                        newUser.email = profile.emails[0].value;
                        // save the user
                        newUser.save(function(err) {
                            if (!err) {
                                return done(null, newUser);
                            } else {
                                User.findOne({email: profile.emails[0].value}, function (err, user) {
                                    if (err)
                                        return done(err);
                                    else
                                    {
                                        user.google.id    = profile.id;
                                        user.google.token = token;
                                        user.password     = token;
                                        user.google.name  = profile.displayName;
                                        user.google.email = profile.emails[0].value; // pull the first email
                                        user.save(function(err) {
                                            if (err)
                                                done(err);
                                            else
                                                return done(null, user);
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }));


    passport.use(new  FacebookStrategy({

            clientID        : configAuth.facebookAuth.clientID,
            clientSecret    : configAuth.facebookAuth.clientSecret,
            callbackURL     : configAuth.facebookAuth.callbackURL,
            profileFields: ['id', 'email', 'last_name', 'first_name', 'gender', 'link', 'locale', 'timezone', 'updated_time', 'verified']
    },
        function(token, refreshToken, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            process.nextTick(function() {

                // try to find the user based on their google id
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, user);
                    } else {
                        // if the user isnt in our database, create a new user
                        var newUser          = new User();

                        // set all of the relevant information
                        newUser.facebook.id    = profile.id;
                        newUser.facebook.token = token;
                        newUser.password     = token;
                        newUser.facebook.firstname  = profile.name.givenName;
                        newUser.facebook.lastname = profile.name.familyName;
                        newUser.facebook.facebookurl = profile.profileUrl;
                        newUser.facebook.gender = profile.gender;
                        newUser.pseudo = profile.name.givenName + "_" + mongoose.Types.ObjectId();
                        newUser.facebook.email = profile.emails[0].value; // pull the first email
                        newUser.email = profile.emails[0].value;
                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                User.findOne({email: profile.emails[0].value}, function (err, user) {
                                    if (err)
                                        return done(err);
                                    else
                                    {
                                        user.facebook.id    = profile.id;
                                        user.facebook.token = token;
                                        user.facebook.firstname  = profile.name.givenName;
                                        user.facebook.lastname = profile.name.familyName;
                                        user.facebook.facebookurl = profile.profileUrl;
                                        user.facebook.gender = profile.gender;
                                        user.facebook.email = profile.emails[0].value; // pull the first email
                                        user.save(function(err) {
                                            if (err)
                                                done(err);
                                            else
                                                return done(null, user);
                                        });
                                    }
                                });
                            else
                                return done(null, newUser);
                        });
                    }
                });
            });

        }));
};