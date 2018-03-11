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
        const error = `db error in getPosts ${JSON.stringify(e)}`;
        throw error;
    }
};

const getArchivePosts = async () => {
    try {
        const { rows } = await pool.query("SELECT * FROM post WHERE start_date < now() - INTERVAL '1 day';"); // eslint-disable-line
        return rows;
    } catch (e) {
        const error = `db error in getPosts ${JSON.stringify(e)}`;
        throw error;
    }
};

const deletePost = async (id) => {
    try {
        await pool.query(`DELETE FROM post WHERE id = ${id};`);
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
        const qs = `INSERT INTO post (title, body, activity, groups, location, start_date, start_time) VALUES ($$${data.title}$$, $$${data.body}$$, $$${data.activity}$$, ${newGroups}, $$${data.location}$$, '${data.launch}', $$${data.time}$$);`;
        const { rows } = await pool.query(qs);
        return rows;
    } catch (e) {
        const error = `db error in addPost ${JSON.stringify(e)}`;
        throw error;
    }
};

const getPost = async (id) => {
    try {
        const { rows } = await pool.query(`SELECT * FROM post WHERE id = ${id}`);
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
        await pool.query(`UPDATE post SET title = $$${data.title}$$, body = $$${data.body}$$, activity = $$${data.activity}$$, groups = ${newGroups}, start_date = '${data.launch}', start_time = $$${data.time}$$, location = $$${data.location}$$ WHERE id = ${data.postId}`);
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
        const qs = `SELECT * FROM post WHERE ((SELECT EXTRACT(EPOCH FROM start_date) * 1000) BETWEEN ${today} AND ${threeDaysFromNow.getTime()});`;
        const { rows } = await pool.query(qs);
        return rows;
    } catch (e) {
        const error = `db error in getNext3DaysPosts ${JSON.stringify(e)}`;
        throw error;
    }
};

const addTag = async (body) => {
    try {
        const { rows } = await pool.query(`SELECT tags FROM post WHERE id = ${body.postId}`);
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
        const q = `UPDATE post SET tags = ${tags} WHERE id = ${body.postId}`;
        await pool.query(q);
        return true;
    } catch (e) {
        const error = `db error in addTag ${e}`;
        throw error;
    }
};

const userCheckin = async (data) => {
    try {
        await pool.query(`INSERT INTO checkins (post_id, user_id) VALUES (${data.act}, ${data.user});`);
        return true;
    } catch (e) {
        if (JSON.stringify(e).indexOf('onecheckinperuser') !== -1) return false;
        const error = `db error in userCheckin ${JSON.stringify(e)}`;
        throw error;
    }
};

const childCheckin = async (data) => {
    try {
        await pool.query(`INSERT INTO checkins (post_id, child_id) VALUES (${data.act}, ${data.user});`);
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
