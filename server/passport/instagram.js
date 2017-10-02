const InstagramStrategy = require('passport-instagram').Strategy;
const userModel = require('./../models/userModel');
const config = require('./../index.json');
const jwt = require('./../middleware/signer');

module.exports = new InstagramStrategy({
    clientID: config.passport.instagram.clientID,
    clientSecret: config.passport.instagram.clientSecret,
    callbackURL: config.passport.instagram.callbackUrl
}, async (accessToken, refreshToken, profile, done) => {
    let user = null;
    try {
        user = await userModel.getUserBySocialId('ig', profile.id);
    } catch (e) {
        if (e === 'No User Found') {
            const names = splitNames(profile.displayName);
            profile.name.familyName = names.lastName;
            profile.name.givenName = names.firstName;
            try {
                user = await userModel.addSocialUser('ig', profile);
            } catch (err) {
                done(err);
            }
        } else done(e);
    }
    if (user) {
        const { token, data } = jwt.signer(user);
        done(null, token, data);
    } else done('User not found');
});

const splitNames = (name) => {
    let firstName = null;
    let lastName = null;
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
    return { firstName, lastName };
};
