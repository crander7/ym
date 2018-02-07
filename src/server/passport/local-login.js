const PassportLocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const userModel = require('./../models/userModel');
const jwt = require('./../utils/jwt');

module.exports = new PassportLocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, async (req, email, password, done) => {
    const userData = {
        email: email.trim(),
        password: password.trim()
    };
    let user = null;
    try {
        user = await userModel.getUserByEmail(userData.email);
    } catch (e) {
        if (e === 'No User Found') {
            const error = new Error('Email provided doesn\'t match any accounts');
            error.name = 'IncorrectCredentialsError';
            done(error);
        } else done(e);
    }
    if (user) {
        bcrypt.compare(userData.password, user.password, (passwordErr, isMatch) => {
            if (passwordErr) done(passwordErr);
            else if (!isMatch) {
                const error = new Error('Incorrect email or password');
                error.name = 'IncorrectCredentialsError';
                done(error);
            } else {
                console.log(`${user.display_name} signed in locally`);
                const { token, data } = jwt.signer(user);
                done(null, token, data);
            }
        });
    }
});
