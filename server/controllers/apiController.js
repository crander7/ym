const pgModel = require('./../db/pgModel');

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

const checkPassword = async (req, res) => {
    try {
        await pgModel.getPassword(req.body.password);
        res.json({ success: true }).status(200);
    } catch (e) {
        res.json({ success: false }).status(503);
    }
};

const getPost = async (req, res) => {
    try {
        const resp = await pgModel.getPost(req.params.id);
        res.json(resp).status(200);
    } catch (e) {
        res.json({ error: e }).status(404);
    }
};

const updatePost = async (req, res) => {
    try {
        await pgModel.updatePost(req.body);
        res.json({ success: true }).status(200);
    } catch (e) {
        res.json({ error: e }).status(404);
    }
};

module.exports = {
    addPost,
    getUpcomingPosts,
    getArchivePosts,
    deletePost,
    checkPassword,
    getPost,
    updatePost
};
