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
        const query = {
            text: 'INSERT INTO users (first_name, last_name, display_name, email, password, birthday) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, birthday = EXCLUDED.birthday RETURNING *',
            values: [data.firstName, data.lastName, data.displayName, data.email, data.password, data.dob]
        };
        const { rows } = await pool.query(query);
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
            const query = {
                text: `INSERT INTO users (first_name, last_name, display_name, ${network}_photo, email, ${network}_id) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO UPDATE SET ${network}_id = EXCLUDED.${network}_id, ${network}_photo = EXCLUDED.${network}_photo RETURNING *`,
                values: [profile.name.givenName, profile.name.familyName, profile.displayName, profile.photos[0].value, profile.emails[0].value, profile.id]
            };
            const { rows } = await pool.query(query);
            if (rows[0]) return rows[0];
            error = { err: 'No User Found', reason: null };
            throw error;
        } catch (e) {
            if (e.reason !== undefined) error = e;
            else error = { err: `db error in addSocialUser on ${profile.provider}: ${e}`, reason: null };
            throw error;
        }
    }
};

const getUserById = async (id) => {
    try {
        const query = {
            text: 'SELECT * FROM users WHERE id = $1',
            values: [id]
        };
        const { rows } = await pool.query(query);
        if (rows[0]) return rows[0];
        const error = 'No User Found';
        throw error;
    } catch (e) {
        let error;
        if (e === 'No User Found') error = e;
        else error = `db error in getUserById ${JSON.stringify(e)}`;
        throw error;
    }
};

const getUserByEmail = async (email) => {
    try {
        const query = {
            text: 'SELECT * FROM users WHERE email = $1',
            values: [email]
        };
        const { rows } = await pool.query(query);
        if (rows[0]) return rows[0];
        const error = 'No User Found';
        throw error;
    } catch (e) {
        let error;
        if (e === 'No User Found') error = e;
        else error = `db error in getUserByEmail ${JSON.stringify(e)}`;
        throw error;
    }
};

const getUserBySocialId = async (network, id) => {
    try {
        const query = {
            text: `SELECT * FROM users WHERE ${network}_id = $1`,
            values: [id]
        };
        const { rows } = await pool.query(query);
        if (rows[0]) return rows[0];
        const error = 'No User Found';
        throw error;
    } catch (e) {
        let error;
        if (e === 'No User Found') error = e;
        else error = `db error in getUserBySocialId ${JSON.stringify(e)}`;
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
    let text = '';
    try {
        if (approved) text = 'UPDATE users SET edit_req = false, account = "editor" WHERE id = $1 RETURNING alerts, phone, email, display_name';
        else text = 'UPDATE users SET edit_req = false WHERE id = $1 RETURNING alerts, phone, email, display_name';
        const query = {
            text,
            values: [id]
        };
        const { rows } = await pool.query(query);
        return rows[0];
    } catch (e) {
        const error = `db error in updateEditReq ${JSON.stringify(e)}`;
        throw error;
    }
};

const updateUser = async (user) => {
    // if (!user.phone) user.phone = null;
    try {
        const query = {
            text: 'UPDATE users SET display_name = $1, first_name = $2, last_name = $3, phone = $4, alerts = $5, alert_days = $6, alert_hour = $7, birthday = $8, edit_req = $9 WHERE id = $10',
            values: [user.display_name, user.first_name, user.last_name, user.phone, user.alerts, user.alert_days, user.alert_hour, user.birthday, user.edit_req, user.id]
        };
        await pool.query(query);
        return true;
    } catch (e) {
        const error = `db error in updateUser ${JSON.stringify(e)}`;
        throw error;
    }
};

const getAllUsers4Notifications = async (hour) => {
    try {
        const query = {
            text: 'SELECT id, alerts, alert_days, alert_hour, class, email, phone, display_name FROM users WHERE account != "parent" AND alerts IN ("email", "text") AND alert_hour = $1',
            values: [hour]
        };
        const { rows } = await pool.query(query);
        return rows;
    } catch (e) {
        const error = `db error in getAllUsers4Notifications ${JSON.stringify(e)}`;
        throw error;
    }
};

const getAllParents4Notification = async (hour) => {
    try {
        const query = {
            text: 'SELECT u.alerts, u.alert_days, u.alert_hour, c.id, c.class, c.name, u.phone, u.email FROM users AS u JOIN children AS c ON u.id = c.user_id WHERE u.account = "parent" AND c.class IS NOT NULL AND u.alerts IN ("email", "text") AND u.alert_hour = $1',
            values: [hour]
        };
        const { rows } = await pool.query(query);
        return rows;
    } catch (e) {
        const error = `db error in getAllParents4Notification ${JSON.stringify(e)}`;
        throw error;
    }
};

const getAllUsers = async () => {
    try {
        const qs = 'SELECT * FROM users WHERE class != "Adults" OR class IS NULL';
        const { rows } = await pool.query(qs);
        return rows;
    } catch (e) {
        const error = `db error in getAllUsers ${JSON.stringify(e)}`;
        throw error;
    }
};

const getAllUsers4Message = async () => {
    try {
        const qs = 'SELECT first_name, last_name, id, email, phone, alerts FROM users';
        const { rows } = await pool.query(qs);
        return rows;
    } catch (e) {
        const error = `db error in getAllUsers4Message ${JSON.stringify(e)}`;
        throw error;
    }
};

const getAllChildren = async () => {
    try {
        const qs = 'SELECT * FROM children WHERE class != "Adults" OR class IS NULL';
        const { rows } = await pool.query(qs);
        return rows;
    } catch (e) {
        const error = `db error in getAllChildren ${JSON.stringify(e)}`;
        throw error;
    }
};

const getChildren = async (id) => {
    try {
        const query = {
            text: 'SELECT * FROM children WHERE user_id = $1',
            values: [id]
        };
        const { rows } = await pool.query(query);
        return rows;
    } catch (e) {
        const error = `db error in getChildren ${JSON.stringify(e)}`;
        throw error;
    }
};

const updateUserClass = async (user) => {
    try {
        const query = {
            text: 'UPDATE users SET class = $1 WHERE id = $2',
            values: [user.class, user.id]
        };
        await pool.query(query);
        return true;
    } catch (e) {
        const error = `db error in updateUserClass ${JSON.stringify(e)}`;
        throw error;
    }
};

const updateChildrenClass = async (user) => {
    try {
        const query = {
            text: 'UPDATE children SET class = $1 WHERE id = $2',
            values: [user.class, user.id]
        };
        await pool.query(query);
        return true;
    } catch (e) {
        const error = `db error in updateChildrenClass ${JSON.stringify(e)}`;
        throw error;
    }
};

const addKid = async (data) => {
    try {
        const query = {
            text: 'INSERT INTO children (name, dob, user_id) VALUES ($1, $2, $3) RETURNING *',
            values: [data.name, data.dob, data.id]
        };
        const { rows } = await pool.query(query);
        return rows;
    } catch (e) {
        const error = `db error in addKid ${JSON.stringify(e)}`;
        throw error;
    }
};

const deleteAccount = async (id) => {
    try {
        const query = {
            text: 'DELETE FROM users WHERE id = $1',
            values: [id]
        };
        await pool.query(query);
        return true;
    } catch (e) {
        const error = `db error in deleteAccount ${JSON.stringify(e)}`;
        throw error;
    }
};

const removeChild = async (id) => {
    try {
        const query = {
            text: 'DELETE FROM children WHERE id = $1',
            values: [id]
        };
        await pool.query(query);
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
        const query = {
            text: 'DELETE FROM children WHERE user_id = $1',
            values: [id]
        };
        const query2 = {
            text: 'UPDATE users SET account = $1 WHERE id = $2',
            values: [status, id]
        };
        if (status === 'user') await pool.query(query);
        await pool.query(query2);
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
