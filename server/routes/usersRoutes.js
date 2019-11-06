const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

const passportConf = require('../config/passport');
const { facebookOAuth } = require('../controllers/usersControllers');

router.post('/oauth/facebook', passport.authenticate('facebookToken', { session: false }), facebookOAuth)

module.exports = router;