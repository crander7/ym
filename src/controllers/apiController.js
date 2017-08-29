const pgModel = require('./../db/pgModel');

const test = async (req, res) => {
    res.json({ success: 'It Works' }).status(200);
};

const getUpcomingPosts = async (req, res) => {
    try {
        const resp = await pgModel.getUpcomingPosts();
        res.json(resp);
    } catch (e) {
        res.json({ error: e }).status(404);
    }
};

const getArchivePosts = async (req, res) => {
    try {
        const resp = await pgModel.getArchivePosts();
        res.json(resp);
    } catch (e) {
        res.json({ error: e }).status(404);
    }
};

const addPost = async (req, res) => {
    try {
        await pgModel.addPost(req.body);
        res.json({ success: 'Post added to db' }).status(200);
    } catch (e) {
        res.json({ error: e }).status(404);
    }
};

const deletePost = async (req, res) => {
    try {
        await pgModel.deletePost(req.body.id);
        res.json({ success: 'post deleted' }).status(200);
    } catch (e) {
        res.json({ error: e }).status(404);
    }
};

module.exports = {
    test,
    addPost,
    getUpcomingPosts,
    getArchivePosts,
    deletePost
};
