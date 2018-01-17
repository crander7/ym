const express = require('express');
const path = require('path');
const compression = require('compression');
const passport = require('passport');
const bodyParser = require('body-parser');
const config = require('./index.json');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
const facebookStrategy = require('./passport/facebook');
const googleStrategy = require('./passport/google');
const email = require('./utils/email');
const cronJob = require('./cron/cronJobs');

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

passport.use('facebook', facebookStrategy);
passport.use('google', googleStrategy);
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

app.use(express.static(path.resolve(__dirname, '../../build')));

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

process.on('uncaughtException', (err) => {
    email.sendErrorReport(err, 'uncaughtException');
});

process.on('unhandledRejection', (reason, place) => {
    email.sendErrorReport(`error @ ${place} reason ${reason}`, 'unhandledRejection');
});

cronJob.reminders.start();
cronJob.classSpot.start();

app.get('*', (req, res) => {
    const filePath = `${__dirname}/../../build/index.html`;
    res.sendFile(path.resolve(filePath));
});

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
