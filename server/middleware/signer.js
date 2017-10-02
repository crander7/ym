const jwt = require('jsonwebtoken');
const config = require('./../index.json');

const signer = (user) => {
    const payload = {
        id: user.id,
        name: user.display_name,
        acct: user.account
    };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1 day' });
    const data = {
        name: user.display_name
    };
    return { token, data };
};

module.exports = {
    signer
};
