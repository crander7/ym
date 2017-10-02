const validator = require('validator');
const passport = require('passport');
const querystring = require('querystring');

const facebook = (req, res, next) => {
    passport.authenticate('facebook', { scope: 'email' })(req, res, next);
};

const fbCallback = (req, res, next) => {
    passport.authenticate('facebook', (err, token, userData) => {
        let query = querystring.stringify({ success: false });
        if (err) {
            query = querystring.stringify({
                success: false,
                message: 'Facebook encountered an error.'
            });
        } else {
            query = querystring.stringify({
                success: true,
                message: 'You have successfully logged in!',
                token,
                user: userData.name
            });
        }
        res.redirect(`http://localhost:3000/addToken/?${query}`);
    })(req, res, next);
};

const google = (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

const googleCb = (req, res, next) => {
    passport.authenticate('google', (err, token, userData) => {
        let query = querystring.stringify({ success: false });
        if (err) {
            query = querystring.stringify({
                success: false,
                message: 'Google encountered an error.'
            });
        } else {
            query = querystring.stringify({
                success: true,
                message: 'You have successfully logged in!',
                token,
                user: userData.name
            });
        }
        res.redirect(`http://localhost:3000/addToken/?${query}`);
    })(req, res, next);
};

const instagram = (req, res, next) => {
    passport.authenticate('instagram', { scope: 'basic' })(req, res, next);
};

const igCallback = (req, res, next) => {
    passport.authenticate('instagram', (err, token, userData) => {
        let query = querystring.stringify({ success: false });
        if (err) {
            query = querystring.stringify({
                success: false,
                message: 'Instagram encountered an error.'
            });
        } else {
            query = querystring.stringify({
                success: true,
                message: 'You have successfully logged in!',
                token,
                user: userData.name
            });
        }
        res.redirect(`http://localhost:3000/addToken/?${query}`);
    })(req, res, next);
};

const localSignUp = (req, res, next) => {
    const validationResult = validateSignupForm(req.body); // eslint-disable-line
    if (!validationResult.success) {
        res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        }).status(400);
    } else {
        passport.authenticate('local-signup', (err, token, userData) => {
            if (err) {
                if (err.name === 'User already exists') {
                    res.json({
                        success: false,
                        message: 'Check the form for errors.',
                        errors: {
                            email: 'This email is already taken.'
                        }
                    }).status(409);
                } else {
                    res.json({
                        success: false,
                        message: 'Could not process the form.'
                    }).status(400);
                }
            } else {
                res.json({
                    success: true,
                    token,
                    user: userData.name
                });
            }
        })(req, res, next);
    }
};

const localLogin = (req, res, next) => {
    const validationResult = validateLoginForm(req.body); // eslint-disable-line
    if (!validationResult.success) {
        res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        }).status(400);
    } else {
        passport.authenticate('local-login', (err, token, userData) => {
            if (err) {
                if (err.name === 'IncorrectCredentialsError') {
                    res.json({
                        success: false,
                        message: err.message
                    }).status(400);
                } else {
                    res.json({
                        success: false,
                        message: 'Could not process the form.'
                    }).status(400);
                }
            } else {
                res.json({
                    success: true,
                    token,
                    user: userData.name
                });
            }
        })(req, res, next);
    }
};

const validateSignupForm = (payload) => {
    const errors = {};
    let isFormValid = true;
    let message = '';
    if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
        isFormValid = false;
        errors.email = 'Please provide a correct email address.';
    }
    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
        isFormValid = false;
        errors.password = 'Password must have at least 8 characters.';
    }
    if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
        isFormValid = false;
        errors.name = 'Please provide your name.';
    }
    if (!isFormValid) message = 'Check the form for errors.';
    return {
        success: isFormValid,
        message,
        errors
    };
};

const validateLoginForm = (payload) => {
    const errors = {};
    let isFormValid = true;
    let message = '';
    if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
        isFormValid = false;
        errors.email = 'Please provide your email address.';
    }
    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
        isFormValid = false;
        errors.password = 'Please provide your password.';
    }
    if (!isFormValid) message = 'Check the form for errors.';
    return {
        success: isFormValid,
        message,
        errors
    };
};

module.exports = {
    localSignUp,
    localLogin,
    facebook,
    fbCallback,
    google,
    googleCb,
    instagram,
    igCallback
};
