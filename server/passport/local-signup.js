const userModel = require('./../models/userModel');
const bcrypt = require('bcrypt');
const PassportLocalStrategy = require('passport-local').Strategy;
const jwt = require('./../middleware/signer');

const saltRounds = 10;

module.exports = new PassportLocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, async (req, email, password, done) => {
    let user = null;
    let error = null;
    const userData = {
        email: email.trim()
    };
    const parsedData = await prepareUserData(req.body.name, password);
    userData.firstName = parsedData.firstName;
    userData.lastName = parsedData.lastName;
    userData.password = parsedData.password;
    userData.displayName = req.body.name;
    userData.dob = req.body.birthday;
    userData.editReq = req.body.editor;
    try {
        user = await userModel.addLocalUser(userData);
    } catch (e) {
        error = e;
    }
    if (user) {
        const { token, data } = jwt.signer(user);
        done(error, token, data);
    } else done('User not found');
});

const prepareUserData = async (name, password) => {
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
    return {
        password: hash,
        firstName,
        lastName
    };
};
