const jwt = require('jsonwebtoken');
const konfig = require('konphyg')(`${__dirname}/../../config`);

const config = konfig('index');

const signer = (user) => {
    const payload = {
        id: user.id,
        name: user.display_name,
        acct: user.account
    };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1 day' });
    const data = {
        name: user.display_name,
        new: user.new,
        id: user.id
    };
    return { token, data };
};

const verify = token => new Promise((resolve) => {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) resolve(false);
        else resolve(decoded);
    });
});

module.exports = {
    signer,
    verify
};
