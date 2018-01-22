const passport = require('passport');
const querystring = require('querystring');
const email = require('./../utils/email');
const validator = require('./../utils/validator');
const redisModel = require('./../models/redisModel');
const jwt = require('./../utils/jwt');
const konfig = require('konphyg')(`${__dirname}/../../config`);

const config = konfig('index');

const check4Token = async (req, res) => {
    let token = false;
    let error = false;
    if (req.params.token) {
        try {
            const user = await jwt.verify(req.params.token);
            token = await redisModel.getTokenById(user.id);
        } catch (e) {
            error = e;
        }
    }
    if (token) {
        res.json({ success: true });
    } else {
        res.json({ authError: true });
        if (error) email.sendErrorReport(error, 'check4Token');
    }
};

const facebook = (req, res, next) => {
    passport.authenticate('facebook', { scope: 'email' })(req, res, next);
};

const fbCallback = (req, res, next) => {
    passport.authenticate('facebook', async (err, token, userData) => {
        let query = querystring.stringify({ success: false });
        if (err) {
            query = querystring.stringify({
                success: false,
                message: 'Facebook encountered an error.'
            });
            email.sendErrorReport(`Facebook encountered and error ${err}`, 'fbCallback');
        } else {
            query = querystring.stringify({
                success: true,
                message: 'You have successfully logged in!',
                token,
                user: userData.name,
                newUser: userData.new
            });
            try {
                await redisModel.setToken(userData.id, token);
            } catch (e) {
                query = querystring.stringify({
                    success: false,
                    message: 'Redis Failed to set token.'
                });
                email.sendErrorReport(`Redis failed to set token ${e}`, 'fbCallback');
            }
        }
        res.redirect(`${config.baseUrl}/addToken/?${query}`);
    })(req, res, next);
};

const google = (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

const googleCb = (req, res, next) => {
    passport.authenticate('google', async (err, token, userData) => {
        let query = querystring.stringify({ success: false });
        if (err) {
            query = querystring.stringify({
                success: false,
                message: 'Google encountered an error.'
            });
            email.sendErrorReport(`Google encountered and error ${err}`, 'googleCb');
        } else {
            query = querystring.stringify({
                success: true,
                message: 'You have successfully logged in!',
                token,
                user: userData.name,
                newUser: userData.new
            });
            try {
                await redisModel.setToken(userData.id, token);
            } catch (e) {
                query = querystring.stringify({
                    success: false,
                    message: 'Redis Failed to set token.'
                });
                email.sendErrorReport(`Redis failed to set token ${e}`, 'googleCb');
            }
        }
        res.redirect(`${config.baseUrl}/addToken/?${query}`);
    })(req, res, next);
};

const localSignUp = (req, res, next) => {
    const validationResult = validator.validateSignupForm(req.body);
    if (!validationResult.success) {
        res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    } else {
        passport.authenticate('local-signup', async (err, token, userData) => {
            if (err) {
                if (err.name === 'User already exists') {
                    res.json({
                        success: false,
                        message: 'Check the form for errors.',
                        errors: {
                            email: 'This email is already taken.'
                        }
                    });
                } else {
                    res.json({
                        success: false,
                        message: 'Could not process the form.'
                    });
                    email.sendErrorReport(`local signup encountered and error ${err}`, 'localSignUp');
                }
            } else {
                try {
                    await redisModel.setToken(userData.id, token);
                    res.json({
                        success: true,
                        token,
                        user: userData.name,
                        newUser: true
                    });
                } catch (e) {
                    res.json({
                        success: false,
                        message: 'Redis Failed to set token.'
                    });
                    email.sendErrorReport(`Redis failed to set token ${e}`, 'localSignUp');
                }
            }
        })(req, res, next);
    }
};

const localLogin = (req, res, next) => {
    const validationResult = validator.validateLoginForm(req.body);
    if (!validationResult.success) {
        res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    } else {
        passport.authenticate('local-login', async (err, token, userData) => {
            if (err) {
                if (err.name === 'IncorrectCredentialsError') {
                    res.json({
                        success: false,
                        message: err.message
                    });
                } else {
                    res.json({
                        success: false,
                        message: 'Could not process the form.'
                    });
                    email.sendErrorReport(`local login encountered and error ${err}`, 'localLogin');
                }
            } else {
                try {
                    await redisModel.setToken(userData.id, token);
                    res.json({
                        success: true,
                        token,
                        user: userData.name
                    });
                } catch (e) {
                    res.json({
                        success: false,
                        message: 'Redis Failed to set token.'
                    });
                    email.sendErrorReport(`Redis failed to set token ${e}`, 'localLogin');
                }
            }
        })(req, res, next);
    }
};

module.exports = {
    localSignUp,
    localLogin,
    facebook,
    fbCallback,
    google,
    googleCb,
    check4Token
};
