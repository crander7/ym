const jwt = require('jsonwebtoken');
const pgModel = require('./../db/pgModel');
const config = require('./../index.json');

module.exports = async (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).end();
    } else {
        const token = req.headers.authorization.split(' ')[1];
        const verified = await verifyToken(token);
        if (!verified) {
            res.status(401).end();
        } else {
            const userId = verified.sub;
            try {
                const user = await pgModel.getUserById(userId);
                if (typeof user === 'object') next();
                else res.status(401).end();
            } catch (e) {
                res.status(401).end();
            }
        }
    }
};

const verifyToken = token => new Promise((resolve) => {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) resolve(false);
        else resolve(decoded);
    });
});