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
        const res = await client.query("SELECT * FROM post WHERE start_date >= now() - INTERVAL '1 day'"); // eslint-disable-line
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
        const res = await client.query('SELECT * FROM post WHERE start_date < NOW();');
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
        client = await pool.connect();
        const res = await client.query(`INSERT INTO post (title, body, activity, party, start_date, start_time) VALUES ($$${data.title}$$, $$${data.body}$$, $$${data.activity}$$, $$${data.party}$$, '${data.launch}', $$${data.time}$$);`);
        client.release();
        resolve(res.rows);
    } catch (e) {
        if (client) client.release();
        const error = `db error in addPost ${JSON.stringify(e)}`;
        reject(error);
    }
});

const getPassword = pass => new Promise(async (resolve, reject) => {
    let client = null;
    try {
        client = await pool.connect();
        const res = await client.query(`SELECT passphrase FROM password WHERE passphrase = $$${pass}$$`);
        client.release();
        if (res.rows[0]) resolve();
        else reject();
    } catch (e) {
        if (client) client.release();
        const error = `db error in getPassword ${JSON.stringify(e)}`;
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
        client = await pool.connect();
        await client.query(`UPDATE post SET title = $$${data.title}$$, body = $$${data.body}$$, activity = $$${data.activity}$$, party = $$${data.party}$$, start_date = '${data.launch}', start_time = $$${data.time}$$ WHERE id = ${data.postId}`);
        client.release();
        resolve();
    } catch (e) {
        if (client) client.release();
        const error = `db error in updatePost ${JSON.stringify(e)}`;
        reject(error);
    }
});

module.exports = {
    getUpcomingPosts,
    getArchivePosts,
    deletePost,
    addPost,
    getPassword,
    getPost,
    updatePost
};
