const validator = require('validator');
const passport = require('passport');

const signUp = (req, res, next) => {
    const validationResult = validateSignupForm(req.body); // eslint-disable-line
    if (!validationResult.success) {
        res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        }).status(400);
    } else {
        passport.authenticate('local-signup', (err) => {
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
                    message: 'You have successfully signed up! Now you should be able to log in.'
                }).status(200);
            }
        })(req, res, next);
    }
};

const login = (req, res, next) => {
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
                    message: 'You have successfully logged in!',
                    token,
                    user: userData
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
    signUp,
    login
};
