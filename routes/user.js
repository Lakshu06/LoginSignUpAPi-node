var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var passport = require('passport');
var jsonwt = require('jsonwebtoken')
var saltRounds = 10
var key = require('../models/config')
require('../middleware/jwt').passport;


router.post("/signup", async (req, res) => {
    var newUser = new User({
        name: req.body.name,
        password: req.body.password
    });

    await User.findOne({ name: newUser.name })
        .then(async profile => {

            if (!profile) {
                bcrypt.hash(newUser.password, saltRounds, async (err, hash) => {
                    if (err) {
                        console.log("Error is", err.message);
                    } else {
                        newUser.password = hash;
                        await newUser
                            .save()
                            .then(() => {
                                res.status(200).json({ message: "user has been register" });
                                console.log(newUser);
                            })
                            .catch(err => {
                                console.log("Error is ", err.message);
                            });
                    }
                });
            } else {
                res.json({ message: "User already exists..." });
            }
        })
        .catch(err => {
            console.log("Error is", err.message);
        });
});

router.post("/login", async (req, res) => {
    var newUser = {};
    newUser.name = req.body.name;
    newUser.password = req.body.password;

    await User.findOne({ name: newUser.name })
        .then(profile => {
            if (!profile) {
                res.json({ message: "User not exist" });
            } else {
                bcrypt.compare(
                    newUser.password,
                    profile.password,
                    async (err, result) => {
                        if (err) {
                            console.log("Error is", err.message);
                        } else if (result == true) {
                            //   res.send("User authenticated");
                            const payload = {
                                id: profile.id,
                                name: profile.name
                            };
                            jsonwt.sign(
                                payload,
                                key.secret,
                                { expiresIn: 3600 },
                                (err, token) => {
                                    res.json({
                                        success: true,
                                        id: payload.id,
                                        name: payload.name,
                                        token: "Bearer " + token
                                    });
                                }
                            );
                        } else {
                            res.json({ message: "User Unauthorized Access" });
                        }
                    }
                );
            }
        })
        .catch(err => {
            console.log("Error is ", err.message);
        });
});
module.exports = router;