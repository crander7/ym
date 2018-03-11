const FacebookStrategy = require('passport-facebook').Strategy;
const userModel = require('./../models/userModel');
const konfig = require('konphyg')(`${__dirname}/../../config`);
const jwt = require('./../utils/jwt');

const config = konfig('index');

module.exports = new FacebookStrategy({
    clientID: config.passport.facebook.appID,
    clientSecret: config.passport.facebook.appSecret,
    callbackURL: config.passport.facebook.callbackUrl,
    profileFields: ['id', 'name', 'displayName', 'picture.type(large)', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    let user = null;
    try {
        user = await userModel.getUserBySocialId('fb', profile.id);
    } catch (e) {
        if (e === 'No User Found') {
            try {
                console.log('profile', profile);
                user = await userModel.addSocialUser('fb', profile);
                if (typeof user === 'object') user.new = true;
            } catch (err) {
                console.log('db add fb', err);
                done(err);
            }
        } else done(e);
    }
    if (user) {
        console.log(`${user.display_name} signed in on fb`);
        const { token, data } = jwt.signer(user);
        done(null, token, data);
    }
});
