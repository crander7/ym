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

const getUpcomingPosts = async () => {
    try {
        const { rows } = await pool.query("SELECT * FROM post WHERE start_date >= now() - INTERVAL '1 day';"); // eslint-disable-line
        return rows;
    } catch (e) {
        const error = `db error in getUpcomingPosts ${JSON.stringify(e)}`;
        throw error;
    }
};

const getArchivePosts = async () => {
    try {
        const { rows } = await pool.query("SELECT * FROM post WHERE start_date < now() - INTERVAL '1 day';"); // eslint-disable-line
        return rows;
    } catch (e) {
        const error = `db error in getArchivePosts ${JSON.stringify(e)}`;
        throw error;
    }
};

const deletePost = async (id) => {
    try {
        const query = {
            text: 'DELETE FROM post WHERE id = $1',
            values: [id]
        };
        await pool.query(query);
        return true;
    } catch (e) {
        const error = `db error in deletePost ${JSON.stringify(e)}`;
        throw error;
    }
};

const addPost = async (data) => {
    try {
        let newGroups = null;
        if (data.groups.length > 0) {
            newGroups = data.groups.map((group, idx) => {
                if (idx === data.groups.length - 1) return `'${group}'`;
                return `'${group}',`;
            });
            newGroups.unshift('ARRAY [');
            newGroups.push(']');
            newGroups = newGroups.join('');
        }
        const query = {
            text: 'INSERT INTO post (title, body, activity, groups, location, start_date, start_time) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            values: [`$$${data.title}$$`, `$$${data.body}$$`, `$$${data.activity}$$`, newGroups, `$$${data.location}$$`, `${data.launch}`, `$$${data.time}$$`]
        };
        const { rows } = await pool.query(query);
        return rows;
    } catch (e) {
        const error = `db error in addPost ${JSON.stringify(e)}`;
        throw error;
    }
};

const getPost = async (id) => {
    try {
        const query = {
            text: 'SELECT * FROM post WHERE id = $1',
            values: [id]
        };
        const { rows } = await pool.query(query);
        return rows;
    } catch (e) {
        const error = `db error in getPost ${JSON.stringify(e)}`;
        throw error;
    }
};

const updatePost = async (data) => {
    try {
        let newGroups = null;
        if (data.groups.length > 0) {
            newGroups = data.groups.map((group, idx) => {
                if (idx === data.groups.length - 1) return `'${group}'`;
                return `'${group}',`;
            });
            newGroups.unshift('ARRAY [');
            newGroups.push(']');
            newGroups = newGroups.join('');
        }
        const query = {
            text: 'UPDATE post SET title = $1, body = $2, activity = $3, groups = $4, start_date = $5, start_time = $6, location = $7 WHERE id = $8',
            values: [`$$${data.title}$$`, `$$${data.body}$$`, `$$${data.activity}$$`, newGroups, `'${data.launch}'`, `$$${data.time}$$`, `$$${data.location}$$`, data.postId]
        };
        await pool.query(query);
        return true;
    } catch (e) {
        const error = `db error in updatePost ${JSON.stringify(e)}`;
        throw error;
    }
};

const getNext3DaysPosts = async (today) => {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    threeDaysFromNow.setHours(0, 0, 0);
    try {
        const query = {
            text: 'SELECT * FROM post WHERE ((SELECT EXTRACT(EPOCH FROM start_date) * 1000) BETWEEN $1 AND $2)',
            values: [today, threeDaysFromNow.getTime()]
        };
        const { rows } = await pool.query(query);
        return rows;
    } catch (e) {
        const error = `db error in getNext3DaysPosts ${JSON.stringify(e)}`;
        throw error;
    }
};

const addTag = async (body) => {
    try {
        const query = {
            text: 'SELECT tags FROM post WHERE id = $1',
            values: [body.postId]
        };
        const { rows } = await pool.query(query);
        const row = rows[0];
        let tags = null;
        if (row.tags && row.tags.length > 0) {
            tags = row.tags.map((tag, idx) => {
                if (idx === row.tags.length - 1) return `'${tag}','${body.tag}'`;
                return `'${tag}',`;
            });
            tags.unshift('ARRAY [');
            tags.push(']');
            tags = tags.join('');
        } else {
            tags = `ARRAY ['${body.tag}']`;
        }
        const query2 = {
            text: 'UPDATE post SET tags = $1 WHERE id = $2',
            values: [tags, body.postId]
        };
        await pool.query(query2);
        return true;
    } catch (e) {
        const error = `db error in addTag ${e}`;
        throw error;
    }
};

const userCheckin = async (data) => {
    try {
        const query = {
            text: 'INSERT INTO checkins (post_id, user_id) VALUES ($1, $2)',
            values: [data.act, data.user]
        };
        await pool.query(query);
        return true;
    } catch (e) {
        if (JSON.stringify(e).indexOf('onecheckinperuser') !== -1) return false;
        const error = `db error in userCheckin ${JSON.stringify(e)}`;
        throw error;
    }
};

const childCheckin = async (data) => {
    try {
        const query = {
            text: 'INSERT INTO checkins (post_id, child_id) VALUES ($1, $2)',
            values: [data.act, data.user]
        };
        await pool.query(query);
        return true;
    } catch (e) {
        if (JSON.stringify(e).indexOf('onecheckinperkid') !== -1) return false;
        const error = `db error in childCheckin ${JSON.stringify(e)}`;
        throw error;
    }
};

module.exports = {
    getUpcomingPosts,
    getArchivePosts,
    deletePost,
    addPost,
    getPost,
    updatePost,
    getNext3DaysPosts,
    addTag,
    userCheckin,
    childCheckin
};
