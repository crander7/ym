const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('./../models/userModel');
const konfig = require('konphyg')(`${__dirname}/../../config`);
const jwt = require('./../utils/jwt');

const config = konfig('index');

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
                console.log('profile', profile);
                user = await userModel.addSocialUser('g', profile);
                if (typeof user === 'object') user.new = true;
            } catch (err) {
                console.log('db add google', err);
                done(err);
            }
        } else done(e);
    }
    if (user) {
        console.log(`${user.display_name} signed in on google`);
        const { token, data } = jwt.signer(user);
        done(null, token, data);
    } else done('User not found');
});
