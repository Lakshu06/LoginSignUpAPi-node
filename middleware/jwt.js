const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const passportJWT = require('passport-jwt');
const User = require('../models/user');
var passport = require('passport');
const myKey = require("../models/config");

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = myKey.secret;

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then(person => {
                    if (person) {
                        return done(null, person);
                    }
                    return done(null, false);
                })
                .catch(err => console.log("hi",err));
        })
    );
};