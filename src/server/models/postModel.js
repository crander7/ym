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

const getUpcomingPosts = () => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const res = await client.query("SELECT * FROM post WHERE start_date >= now() - INTERVAL '1 day';"); // eslint-disable-line
        client.release();
        resolve(res.rows);
    } catch (e) {
        if (client) client.release();
        const error = `db error in getPosts ${JSON.stringify(e)}`;
        reject(error);
    }
});

const getArchivePosts = () => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const res = await client.query("SELECT * FROM post WHERE start_date < now() - INTERVAL '1 day';"); // eslint-disable-line
        client.release();
        resolve(res.rows);
    } catch (e) {
        if (client) client.release();
        const error = `db error in getPosts ${JSON.stringify(e)}`;
        reject(error);
    }
});

const deletePost = id => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        await client.query(`DELETE FROM post WHERE id = ${id};`);
        client.release();
        resolve();
    } catch (e) {
        if (client) client.release();
        const error = `db error in deletePost ${JSON.stringify(e)}`;
        reject(error);
    }
});

const addPost = data => new Promise(async (resolve, reject) => {
    let client = null;
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
        client = await pool.connect();
        const qs = `INSERT INTO post (title, body, activity, groups, location, start_date, start_time) VALUES ($$${data.title}$$, $$${data.body}$$, $$${data.activity}$$, ${newGroups}, $$${data.location}$$, '${data.launch}', $$${data.time}$$);`;
        const res = await client.query(qs);
        client.release();
        resolve(res.rows);
    } catch (e) {
        if (client) client.release();
        const error = `db error in addPost ${JSON.stringify(e)}`;
        reject(error);
    }
});

const getPost = id => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const res = await client.query(`SELECT * FROM post WHERE id = ${id}`);
        client.release();
        resolve(res.rows);
    } catch (e) {
        if (client) client.release();
        const error = `db error in getPost ${JSON.stringify(e)}`;
        reject(error);
    }
});

const updatePost = data => new Promise(async (resolve, reject) => {
    let client = null;
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
        client = await pool.connect();
        await client.query(`UPDATE post SET title = $$${data.title}$$, body = $$${data.body}$$, activity = $$${data.activity}$$, groups = ${newGroups}, start_date = '${data.launch}', start_time = $$${data.time}$$, location = $$${data.location}$$ WHERE id = ${data.postId}`);
        client.release();
        resolve();
    } catch (e) {
        if (client) client.release();
        const error = `db error in updatePost ${JSON.stringify(e)}`;
        reject(error);
    }
});

const getNext3DaysPosts = today => new Promise(async (resolve, reject) => {
    let client = null;
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    threeDaysFromNow.setHours(0, 0, 0);
    try {
        client = await pool.connect();
        const qs = `SELECT * FROM post WHERE ((SELECT EXTRACT(EPOCH FROM start_date) * 1000) BETWEEN ${today} AND ${threeDaysFromNow.getTime()});`;
        const res = await client.query(qs);
        client.release();
        resolve(res.rows);
    } catch (e) {
        if (client) client.release();
        const error = `db error in getNext3DaysPosts ${JSON.stringify(e)}`;
        reject(error);
    }
});

const addTag = body => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const res = await client.query(`SELECT tags FROM post WHERE id = ${body.postId}`);
        const row = res.rows[0];
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
        await client.query(q);
        client.release();
        resolve();
    } catch (e) {
        if (client) client.release();
        const error = `db error in addTag ${e}`;
        reject(error);
    }
});

module.exports = {
    getUpcomingPosts,
    getArchivePosts,
    deletePost,
    addPost,
    getPost,
    updatePost,
    getNext3DaysPosts,
    addTag
};
