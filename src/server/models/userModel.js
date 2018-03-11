const pg = require('pg');
const konfig = require('konphyg')(`${__dirname}/../../config`);

const config = konfig('index');

const dbConfig = {
    user: config.postgreSQL.username,
    database: config.postgreSQL.database,
    host: config.postgreSQL.host,
    port: config.postgreSQL.port,
    password: config.postgreSQL.password,
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
    if (!network || !profile.name || !profile.name.givenName || !profile.name.familyName || !profile.displayName || !profile.photos || !profile.photos[0] || !profile.photos[0].value || !profile.emails || !profile.emails[0] || !profile.emails[0].value || !profile.id) {
        if (!profile.name || !profile.name.givenName || !profile.name.familyName || !profile.displayName) reject({ err: 'Account issue', reason: 'name' });
        else if (!profile.photos || !profile.photos[0] || !profile.photos[0].value) reject({ err: 'Account issue', reason: 'photo' });
        else if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) reject({ err: 'Account issue', reason: 'email' });
        else reject({ err: 'Account issue', reason: 'other' });
    } else {
        try {
            client = await pool.connect();
            const q = `INSERT INTO users (first_name, last_name, display_name, ${network}_photo, email, ${network}_id) VALUES ($$${profile.name.givenName}$$, $$${profile.name.familyName}$$, $$${profile.displayName}$$, $$${profile.photos[0].value}$$, $$${profile.emails[0].value}$$, $$${profile.id}$$) ON CONFLICT (email) DO UPDATE SET ${network}_id = EXCLUDED.${network}_id, ${network}_photo = EXCLUDED.${network}_photo RETURNING *;`;
            const res = await client.query(q);
            client.release();
            if (res.rows[0]) resolve(res.rows[0]);
            else reject({ err: 'No User Found', reason: null });
        } catch (e) {
            if (client) client.release();
            const error = `db error in addSocialUser on ${profile.provider}: ${e}`;
            reject({ err: error, reason: null });
        }
    }
});

const getUserById = id => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const res = await client.query(`SELECT * FROM users WHERE id = ${id};`);
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
        const res = await client.query(`SELECT * FROM users WHERE email = $$${email}$$;`);
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
        const res = await client.query(`SELECT * FROM users WHERE ${network}_id = $$${id}$$;`);
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
        const res = await client.query('SELECT * FROM users WHERE edit_req = TRUE;');
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
        await client.query(`UPDATE users SET display_name = $$${user.display_name}$$, first_name = $$${user.first_name}$$, last_name = $$${user.last_name}$$, phone = ${user.phone ? `${user.phone}` : null}, alerts = ${user.alerts ? `'${user.alerts}'` : null}, alert_days = ${user.alert_days}, alert_hour = ${user.alert_hour}, birthday = ${user.birthday ? `'${user.birthday}'` : null}, edit_req = ${user.edit_req} WHERE id = ${user.id};`); // eslint-disable-line
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
        const qs = `SELECT id, alerts, alert_days, alert_hour, class, email, phone, display_name FROM users WHERE account != 'parent' AND alerts IN ('email', 'text') AND alert_hour = ${hour}`;
        const res = await client.query(qs);
        client.release();
        resolve(res.rows);
    } catch (e) {
        if (client) client.release();
        const error = `db error in getAllUsers4Notifications ${JSON.stringify(e)}`;
        reject(error);
    }
});

const getAllParents4Notification = hour => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const qs = `SELECT u.alerts, u.alert_days, u.alert_hour, c.id, c.class, c.name, u.phone, u.email FROM users AS u JOIN children AS c ON u.id = c.user_id WHERE u.account = 'parent' AND c.class IS NOT NULL AND u.alerts IN ('email', 'text') AND u.alert_hour = ${hour};`;
        const res = await client.query(qs);
        client.release();
        resolve(res.rows);
    } catch (e) {
        if (client) client.release();
        const error = `db error in getAllParents4Notification ${JSON.stringify(e)}`;
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

const getAllUsers4Message = () => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const qs = 'SELECT first_name, last_name, id, email, phone, alerts FROM users;';
        const res = await client.query(qs);
        client.release();
        resolve(res.rows);
    } catch (e) {
        if (client) client.release();
        const error = `db error in getAllUsers4Message ${JSON.stringify(e)}`;
        reject(error);
    }
});

const getAllChildren = () => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const qs = 'SELECT * FROM children WHERE class != \'Adults\' OR class IS NULL;';
        const res = await client.query(qs);
        client.release();
        resolve(res.rows);
    } catch (e) {
        if (client) client.release();
        const error = `db error in getAllChildren ${JSON.stringify(e)}`;
        reject(error);
    }
});

const getChildren = id => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const qs = `SELECT * FROM children WHERE user_id = ${id};`;
        const res = await client.query(qs);
        client.release();
        resolve(res.rows);
    } catch (e) {
        if (client) client.release();
        const error = `db error in getChildren ${JSON.stringify(e)}`;
        reject(error);
    }
});

const updateUserClass = user => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const qs = `UPDATE users SET class = '${user.class}' WHERE id = ${user.id};`;
        await client.query(qs);
        client.release();
        resolve();
    } catch (e) {
        if (client) client.release();
        const error = `db error in updateUserClass ${JSON.stringify(e)}`;
        reject(error);
    }
});

const updateChildrenClass = user => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const qs = `UPDATE children SET class = '${user.class}' WHERE id = ${user.id};`;
        await client.query(qs);
        client.release();
        resolve();
    } catch (e) {
        if (client) client.release();
        const error = `db error in updateChildrenClass ${JSON.stringify(e)}`;
        reject(error);
    }
});

const addKid = data => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const res = await client.query(`INSERT INTO children (name, dob, user_id) VALUES ($$${data.name}$$, '${data.dob}', ${data.id}) returning *;`);
        client.release();
        resolve(res.rows);
    } catch (e) {
        if (client) client.release();
        const error = `db error in addKid ${JSON.stringify(e)}`;
        reject(error);
    }
});

const deleteAccount = id => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        await client.query(`DELETE FROM children WHERE user_id = ${id};`);
        await client.query(`DELETE FROM users WHERE id = ${id};`);
        client.release();
        resolve();
    } catch (e) {
        if (client) client.release();
        const error = `db error in deleteAccount ${JSON.stringify(e)}`;
        reject(error);
    }
});

const removeChild = id => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const qs = `DELETE FROM children WHERE id = ${id};`;
        await client.query(qs);
        client.release();
        resolve();
    } catch (e) {
        if (client) client.release();
        const error = `db error in removeChild ${JSON.stringify(e)}`;
        reject(error);
    }
});

const setParent = (val, id) => new Promise(async (resolve, reject) => {
    let client = null;
    let status = 'user';
    if (val === 'parent') status = 'parent';
    try {
        client = await pool.connect();
        if (status === 'user') await client.query(`DELETE FROM children WHERE user_id = ${id};`);
        await client.query(`UPDATE users SET account = '${status}' WHERE id = ${id};`);
        client.release();
        resolve();
    } catch (e) {
        if (client) client.release();
        const error = `db error in setParent ${JSON.stringify(e)}`;
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
    updateUserClass,
    getAllParents4Notification,
    getAllChildren,
    updateChildrenClass,
    deleteAccount,
    removeChild,
    addKid,
    setParent,
    getChildren,
    getAllUsers4Message
};
