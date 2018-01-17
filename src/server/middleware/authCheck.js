const redisModel = require('./../models/redisModel');
const jwt = require('./../utils/jwt');
const email = require('./../utils/email');

module.exports = async (req, res, next) => {
    if (!req.headers.authorization) {
        res.json({ authError: true });
        email.sendErrorReport('No auth header', 'authCheck first if');
    } else {
        let decoded = false;
        const token = req.headers.authorization.split(' ')[1];
        try {
            decoded = await jwt.verify(token);
        } catch (e) {
            email.sendErrorReport(`jwt decode error ${e}`, 'authCheck decode');
        }
        if (!decoded) {
            res.json({ authError: true });
        } else {
            const userId = decoded.id;
            try {
                const user = await redisModel.getTokenById(userId);
                if (user) {
                    req.userId = userId;
                    next();
                } else res.json({ authError: true });
            } catch (e) {
                res.json({ authError: true });
                email.sendErrorReport(`redis get error ${e}`, 'authCheck redis get');
            }
        }
    }
};
