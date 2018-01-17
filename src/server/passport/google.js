const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('./../models/userModel');
const config = require('./../index.json');
const jwt = require('./../utils/jwt');

module.exports = new GoogleStrategy({
    clientID: config.passport.google.clientID,
    clientSecret: config.passport.google.clientSecret,
    callbackURL: config.passport.google.callbackUrl
}, async (accessToken, refreshToken, profile, done) => {
    let user = null;
    try {
        user = await userModel.getUserBySocialId('g', profile.id);
    } catch (e) {
        if (e === 'No User Found') {
            try {
                user = await userModel.addSocialUser('g', profile);
                if (typeof user === 'object') user.new = true;
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
