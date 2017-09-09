const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const config = require('./index.json');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');

const app = express();

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
