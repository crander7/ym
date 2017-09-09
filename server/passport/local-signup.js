const pgModel = require('./../db/pgModel');
const bcrypt = require('bcrypt');
const PassportLocalStrategy = require('passport-local').Strategy;

const saltRounds = 10;

module.exports = new PassportLocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, async (req, email, password, done) => {
    const userData = {
        email: email.trim()
    };
    const parsedData = await prepareUserData(req.body.name, password);
    userData.firstName = parsedData.firstName;
    userData.lastName = parsedData.lastName;
    userData.password = parsedData.password;
    try {
        await pgModel.addUser(userData);
        done(null);
    } catch (e) {
        done(e);
    }
});

const prepareUserData = (name, password) => new Promise(async (resolve) => {
    let firstName = null;
    let lastName = null;
    let hash = null;
    const nameArr = name.trim().split(' ');
    if (nameArr.length === 2) {
        firstName = nameArr[0];
        lastName = nameArr[1];
    } else if (nameArr.length === 1) {
        firstName = nameArr[0];
        lastName = null;
    } else {
        firstName = nameArr[0];
        lastName = nameArr[nameArr.length - 1];
    }
    try {
        hash = await bcrypt.hash(password, saltRounds);
    } catch (e) {
        hash = null;
    }
    resolve({
        password: hash,
        firstName,
        lastName
    });
});
