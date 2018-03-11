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

const addLocalUser = async (data) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO users (first_name, last_name, display_name, email, password, birthday) 
                VALUES ($$${data.firstName}$$, $$${data.lastName}$$, $$${data.displayName}$$, $$${data.email}$$, $$${data.password}$$, '${data.dob}') 
            ON CONFLICT (email) 
                DO UPDATE
                SET password = EXCLUDED.password, birthday = EXCLUDED.birthday
                RETURNING *;
        `);
        return rows[0];
    } catch (e) {
        const error = `db error in addLocalUser ${JSON.stringify(e)}`;
        throw error;
    }
};

const addSocialUser = async (network, profile) => {
    let error = {};
    if (!network || !profile.name || !profile.name.givenName || !profile.name.familyName || !profile.displayName || !profile.photos || !profile.photos[0] || !profile.photos[0].value || !profile.emails || !profile.emails[0] || !profile.emails[0].value || !profile.id) {
        error.err = 'Account issue';
        if (!profile.name || !profile.name.givenName || !profile.name.familyName || !profile.displayName) error.reason = 'name';
        else if (!profile.photos || !profile.photos[0] || !profile.photos[0].value) error.reason = 'photo';
        else if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) error.reason = 'email';
        else error.reason = 'other';
        throw error;
    } else {
        try {
            const q = `INSERT INTO users (first_name, last_name, display_name, ${network}_photo, email, ${network}_id) VALUES ($$${profile.name.givenName}$$, $$${profile.name.familyName}$$, $$${profile.displayName}$$, $$${profile.photos[0].value}$$, $$${profile.emails[0].value}$$, $$${profile.id}$$) ON CONFLICT (email) DO UPDATE SET ${network}_id = EXCLUDED.${network}_id, ${network}_photo = EXCLUDED.${network}_photo RETURNING *;`;
            const { rows } = await pool.query(q);
            if (rows[0]) return rows[0];
            error = { err: 'No User Found', reason: null };
            throw error;
        } catch (e) {
            error = { err: `db error in addSocialUser on ${profile.provider}: ${e}`, reason: null };
            throw error;
        }
    }
};

const getUserById = async (id) => {
    try {
        const { rows } = await pool.query(`SELECT * FROM users WHERE id = ${id};`);
        if (rows[0]) return rows[0];
        const error = 'No User Found';
        throw error;
    } catch (e) {
        const error = `db error in getUserById ${JSON.stringify(e)}`;
        throw error;
    }
};

const getUserByEmail = async (email) => {
    try {
        const { rows } = await pool.query(`SELECT * FROM users WHERE email = $$${email}$$;`);
        if (rows[0]) return rows[0];
        const error = 'No User Found';
        throw error;
    } catch (e) {
        const error = `db error in getUserByEmail ${JSON.stringify(e)}`;
        throw error;
    }
};

const getUserBySocialId = async (network, id) => {
    try {
        const { rows } = await pool.query(`SELECT * FROM users WHERE ${network}_id = $$${id}$$;`);
        if (rows[0]) return rows[0];
        const error = 'No User Found';
        throw error;
    } catch (e) {
        const error = `db error in getUserByFbId ${JSON.stringify(e)}`;
        throw error;
    }
};

const getEditReqs = async () => {
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE edit_req = TRUE;');
        return rows;
    } catch (e) {
        const error = `db error in getEditReqs ${JSON.stringify(e)}`;
        throw error;
    }
};

const updateEditReq = async (id, approved) => {
    let query = '';
    try {
        if (approved) query = `UPDATE users SET edit_req = false, account = 'editor' WHERE id = ${id} RETURNING alerts, phone, email, display_name;`;
        else query = `UPDATE users SET edit_req = false WHERE id = ${id} RETURNING alerts, phone, email, display_name;`;
        const { rows } = await pool.query(query);
        return rows[0];
    } catch (e) {
        const error = `db error in updateEditReq ${JSON.stringify(e)}`;
        throw error;
    }
};

const updateUser = async (user) => {
    try {
        await pool.query(`UPDATE users SET display_name = $$${user.display_name}$$, first_name = $$${user.first_name}$$, last_name = $$${user.last_name}$$, phone = ${user.phone ? `${user.phone}` : null}, alerts = ${user.alerts ? `'${user.alerts}'` : null}, alert_days = ${user.alert_days}, alert_hour = ${user.alert_hour}, birthday = ${user.birthday ? `'${user.birthday}'` : null}, edit_req = ${user.edit_req} WHERE id = ${user.id};`); // eslint-disable-line
        return true;
    } catch (e) {
        const error = `db error in updateUser ${JSON.stringify(e)}`;
        throw error;
    }
};

const getAllUsers4Notifications = async (hour) => {
    try {
        const qs = `SELECT id, alerts, alert_days, alert_hour, class, email, phone, display_name FROM users WHERE account != 'parent' AND alerts IN ('email', 'text') AND alert_hour = ${hour}`;
        const { rows } = await pool.query(qs);
        return rows;
    } catch (e) {
        const error = `db error in getAllUsers4Notifications ${JSON.stringify(e)}`;
        throw error;
    }
};

const getAllParents4Notification = async (hour) => {
    try {
        const qs = `SELECT u.alerts, u.alert_days, u.alert_hour, c.id, c.class, c.name, u.phone, u.email FROM users AS u JOIN children AS c ON u.id = c.user_id WHERE u.account = 'parent' AND c.class IS NOT NULL AND u.alerts IN ('email', 'text') AND u.alert_hour = ${hour};`;
        const { rows } = await pool.query(qs);
        return rows;
    } catch (e) {
        const error = `db error in getAllParents4Notification ${JSON.stringify(e)}`;
        throw error;
    }
};

const getAllUsers = async () => {
    try {
        const qs = 'SELECT * FROM users WHERE class != \'Adults\' OR class IS NULL;';
        const { rows } = await pool.query(qs);
        return rows;
    } catch (e) {
        const error = `db error in getAllUsers ${JSON.stringify(e)}`;
        throw error;
    }
};

const getAllUsers4Message = async () => {
    try {
        const qs = 'SELECT first_name, last_name, id, email, phone, alerts FROM users;';
        const { rows } = await pool.query(qs);
        return rows;
    } catch (e) {
        const error = `db error in getAllUsers4Message ${JSON.stringify(e)}`;
        throw error;
    }
};

const getAllChildren = async () => {
    try {
        const qs = 'SELECT * FROM children WHERE class != \'Adults\' OR class IS NULL;';
        const { rows } = await pool.query(qs);
        return rows;
    } catch (e) {
        const error = `db error in getAllChildren ${JSON.stringify(e)}`;
        throw error;
    }
};

const getChildren = async (id) => {
    try {
        const qs = `SELECT * FROM children WHERE user_id = ${id};`;
        const { rows } = await pool.query(qs);
        return rows;
    } catch (e) {
        const error = `db error in getChildren ${JSON.stringify(e)}`;
        throw error;
    }
};

const updateUserClass = async (user) => {
    try {
        const qs = `UPDATE users SET class = '${user.class}' WHERE id = ${user.id};`;
        await pool.query(qs);
        return true;
    } catch (e) {
        const error = `db error in updateUserClass ${JSON.stringify(e)}`;
        throw error;
    }
};

const updateChildrenClass = async (user) => {
    try {
        const qs = `UPDATE children SET class = '${user.class}' WHERE id = ${user.id};`;
        await pool.query(qs);
        return true;
    } catch (e) {
        const error = `db error in updateChildrenClass ${JSON.stringify(e)}`;
        throw error;
    }
};

const addKid = async (data) => {
    try {
        const { rows } = await pool.query(`INSERT INTO children (name, dob, user_id) VALUES ($$${data.name}$$, '${data.dob}', ${data.id}) returning *;`);
        return rows;
    } catch (e) {
        const error = `db error in addKid ${JSON.stringify(e)}`;
        throw error;
    }
};

const deleteAccount = async (id) => {
    try {
        await pool.query(`DELETE FROM users WHERE id = ${id};`);
        return true;
    } catch (e) {
        const error = `db error in deleteAccount ${JSON.stringify(e)}`;
        throw error;
    }
};

const removeChild = async (id) => {
    try {
        const qs = `DELETE FROM children WHERE id = ${id};`;
        await pool.query(qs);
        return true;
    } catch (e) {
        const error = `db error in removeChild ${JSON.stringify(e)}`;
        throw error;
    }
};

const setParent = async (val, id) => {
    let status = 'user';
    if (val === 'parent') status = 'parent';
    try {
        if (status === 'user') await pool.query(`DELETE FROM children WHERE user_id = ${id};`);
        await pool.query(`UPDATE users SET account = '${status}' WHERE id = ${id};`);
        return true;
    } catch (e) {
        const error = `db error in setParent ${JSON.stringify(e)}`;
        throw error;
    }
};

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
