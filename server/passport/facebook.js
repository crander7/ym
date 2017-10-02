const FacebookStrategy = require('passport-facebook').Strategy;
const userModel = require('./../models/userModel');
const config = require('./../index.json');
const jwt = require('./../middleware/signer');

module.exports = new FacebookStrategy({
    clientID: config.passport.facebook.appID,
    clientSecret: config.passport.facebook.appSecret,
    callbackURL: config.passport.facebook.callbackUrl,
    profileFields: ['id', 'name', 'displayName', 'photos', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    let user = null;
    try {
        user = await userModel.getUserBySocialId('fb', profile.id);
    } catch (e) {
        if (e === 'No User Found') {
            try {
                user = await userModel.addSocialUser('fb', profile);
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
