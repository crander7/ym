const pg = require('pg');
const config = require('./../index.json').postgreSQL;

const dbConfig = {
    user: config.username,
    database: config.database,
    host: config.host,
    port: config.port,
    password: config.password,
    max: 20,
    min: 4
};

const pool = new pg.Pool(dbConfig);

process.on('exit', () => {
    pool.end();
});

const addLocalUser = data => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const res = await client.query(`
            INSERT INTO users (first_name, last_name, display_name, email, password, birthday) 
                VALUES ($$${data.firstName}$$, $$${data.lastName}$$, $$${data.displayName}$$, $$${data.email}$$, $$${data.password}$$, '${data.dob}') 
            ON CONFLICT (email) 
                DO UPDATE
                SET password = EXCLUDED.password, birthday = EXCLUDED.birthday
                RETURNING *;
        `);
        client.release();
        resolve(res.rows[0]);
    } catch (e) {
        if (client) client.release();
        const error = `db error in addLocalUser ${JSON.stringify(e)}`;
        reject(error);
    }
});

const addSocialUser = (network, profile) => new Promise(async (resolve, reject) => {
    let client = null;
    if (network === 'ig') {
        profile.photos = [{ value: profile._json.data.profile_picture }]; // eslint-disable-line
        profile.emails = [{ value: null }];
    }
    try {
        client = await pool.connect();
        const res = await client.query(`
            INSERT INTO users (first_name, last_name, display_name, ${network}_photo, email, ${network}_id) 
                VALUES ($$${profile.name.givenName}$$, $$${profile.name.familyName}$$, $$${profile.displayName}$$, $$${profile.photos[0].value}$$, $$${profile.emails[0].value}$$, $$${profile.id}$$) 
            ON CONFLICT (email) 
                DO UPDATE 
                SET ${network}_id = EXCLUDED.${network}_id, ${network}_photo = EXCLUDED.${network}_photo
            RETURNING *;
        `);
        client.release();
        if (res.rows[0]) resolve(res.rows[0]);
        else reject('No User Found');
    } catch (e) {
        if (client) client.release();
        const error = `db error in addSocialUser on ${profile.provider}: ${JSON.stringify(e)}`;
        reject(error);
    }
});

const getUserById = id => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const res = await client.query(`SELECT * FROM users WHERE id = ${id}`);
        client.release();
        if (res.rows[0]) resolve(res.rows[0]);
        else reject('No User Found');
    } catch (e) {
        if (client) client.release();
        const error = `db error in getUserById ${JSON.stringify(e)}`;
        reject(error);
    }
});

const getUserByEmail = email => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const res = await client.query(`SELECT * FROM users WHERE email = $$${email}$$`);
        client.release();
        if (res.rows[0]) resolve(res.rows[0]);
        else reject('No User Found');
    } catch (e) {
        if (client) client.release();
        const error = `db error in getUserByEmail ${JSON.stringify(e)}`;
        reject(error);
    }
});

const getUserBySocialId = (network, id) => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const res = await client.query(`SELECT * FROM users WHERE ${network}_id = $$${id}$$`);
        client.release();
        if (res.rows[0]) resolve(res.rows[0]);
        else reject('No User Found');
    } catch (e) {
        if (client) client.release();
        const error = `db error in getUserByFbId ${JSON.stringify(e)}`;
        reject(error);
    }
});

const getEditReqs = () => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const res = await client.query('SELECT * FROM users WHERE edit_req = true');
        client.release();
        resolve(res.rows);
    } catch (e) {
        if (client) client.release();
        const error = `db error in getEditReqs ${JSON.stringify(e)}`;
        reject(error);
    }
});

const updateEditReq = (id, approved) => new Promise(async (resolve, reject) => {
    let client = null;
    let query = '';
    try {
        client = await pool.connect();
        if (approved) query = `UPDATE users SET edit_req = false, account = 'editor' WHERE id = ${id} RETURNING alerts, phone, email, display_name;`;
        else query = `UPDATE users SET edit_req = false WHERE id = ${id} RETURNING alerts, phone, email, display_name;`;
        const res = await client.query(query);
        client.release();
        resolve(res.rows[0]);
    } catch (e) {
        if (client) client.release();
        const error = `db error in updateEditReq ${JSON.stringify(e)}`;
        reject(error);
    }
});

const updateUser = user => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        await client.query(`UPDATE users SET display_name = $$${user.display_name}$$, first_name = $$${user.first_name}$$, last_name = $$${user.last_name}$$, phone = ${user.phone ? `${user.phone}` : null}, alerts = ${user.alerts ? `'${user.alerts}'` : null}, alert_days = ${user.alert_days}, alert_hour = ${user.alert_hour}, birthday = ${user.birthday ? `'${user.birthday}'` : null}, edit_req = ${user.edit_req} WHERE id = ${user.id}`); // eslint-disable-line
        client.release();
        resolve();
    } catch (e) {
        if (client) client.release();
        const error = `db error in updateUser ${JSON.stringify(e)}`;
        reject(error);
    }
});

const getAllUsers4Notifications = hour => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const qs = `SELECT * FROM users WHERE alerts IN ('email', 'text') AND alert_hour = ${hour}`;
        const res = await client.query(qs);
        client.release();
        resolve(res.rows);
    } catch (e) {
        if (client) client.release();
        const error = `db error in getAllUsers4Notifications ${JSON.stringify(e)}`;
        reject(error);
    }
});

const getAllUsers = () => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const qs = 'SELECT * FROM users WHERE class != \'Adults\' OR class IS NULL;';
        const res = await client.query(qs);
        client.release();
        resolve(res.rows);
    } catch (e) {
        if (client) client.release();
        const error = `db error in getAllUsers ${JSON.stringify(e)}`;
        reject(error);
    }
});

const updateUserClass = user => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const qs = `UPDATE users SET class = '${user.class}' WHERE id = ${user.id}`;
        await client.query(qs);
        client.release();
        resolve();
    } catch (e) {
        if (client) client.release();
        const error = `db error in updateUserClass ${JSON.stringify(e)}`;
        reject(error);
    }
});

module.exports = {
    addLocalUser,
    getUserById,
    getUserByEmail,
    getUserBySocialId,
    addSocialUser,
    getEditReqs,
    updateEditReq,
    updateUser,
    getAllUsers4Notifications,
    getAllUsers,
    updateUserClass
};
