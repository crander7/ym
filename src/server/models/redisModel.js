const Redis = require('ioredis');

const redis = new Redis();
const SEVEN_DAYS = 604800;

const setToken = (id, token) => new Promise((resolve, reject) => {
    redis.setex(id, SEVEN_DAYS, token, (err, result) => {
        if (err) reject(err);
        else resolve(result);
    });
});

const deleteToken = id => new Promise((resolve, reject) => {
    redis.del(id, (err, result) => {
        if (err) reject(err);
        else resolve(result);
    });
});

const getTokenById = id => new Promise((resolve, reject) => {
    redis.get(id, (err, result) => {
        if (err) reject(err);
        else resolve(result);
    });
});

module.exports = {
    setToken,
    deleteToken,
    getTokenById
};
