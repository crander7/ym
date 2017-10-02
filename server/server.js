const express = require('express');
const path = require('path');
const compression = require('compression');
const passport = require('passport');
const config = require('./index.json');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
const facebookStrategy = require('./passport/facebook');
const googleStrategy = require('./passport/google');
const instgramStrategy = require('./passport/instagram');

const app = express();

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

passport.use('facebook', facebookStrategy);
passport.use('instagram', instgramStrategy);
passport.use('google', googleStrategy);
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
});

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
