const jwt = require('jsonwebtoken');
const PassportLocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pgModel = require('./../db/pgModel');
const config = require('./../index.json');

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
        user = await pgModel.getUserByEmail(userData.email);
    } catch (e) {
        if (e === 'No User Found') {
            const error = new Error('Incorrect email or password');
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
                const payload = {
                    sub: user.id
                };
                const token = jwt.sign(payload, config.jwtSecret);
                const data = {
                    name: `${user.firstName} ${user.lastName}`
                };
                done(null, token, data);
            }
        });
    }
});
