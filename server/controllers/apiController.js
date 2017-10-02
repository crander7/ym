const postModel = require('./../models/postModel');
const userModel = require('./../models/userModel');
const email = require('./../utils/email');
const text = require('./../utils/text');

const getUpcomingPosts = async (req, res) => {
    try {
        const resp = await postModel.getUpcomingPosts();
        res.json(resp);
    } catch (e) {
        res.json({ error: e }).status(404);
    }
};

const getArchivePosts = async (req, res) => {
    try {
        const resp = await postModel.getArchivePosts();
        res.json(resp);
    } catch (e) {
        res.json({ error: e }).status(404);
    }
};

const addPost = async (req, res) => {
    try {
        await postModel.addPost(req.body);
        res.json({ success: 'Post added to db' }).status(200);
    } catch (e) {
        res.json({ error: e }).status(404);
    }
};

const deletePost = async (req, res) => {
    try {
        await postModel.deletePost(req.body.id);
        res.json({ success: 'post deleted' }).status(200);
    } catch (e) {
        res.json({ error: e }).status(404);
    }
};

const getPost = async (req, res) => {
    try {
        const resp = await postModel.getPost(req.params.id);
        res.json(resp).status(200);
    } catch (e) {
        res.json({ error: e }).status(404);
    }
};

const updatePost = async (req, res) => {
    try {
        await postModel.updatePost(req.body);
        res.json({ success: true }).status(200);
    } catch (e) {
        res.json({ error: e }).status(404);
    }
};

const getEditReqs = async (req, res) => {
    try {
        const resp = await userModel.getEditReqs();
        res.json(resp);
    } catch (e) {
        res.json({ error: e }).status(404);
    }
};

const handleEditReq = async (req, res) => {
    let approved = false;
    if (req.body.approved) approved = true;
    try {
        const resp = await userModel.updateEditReq(req.body.id, req.body.acct, approved);
        res.json({ success: 'It worked' });
        if (resp && resp.alert === 'email') email.sendDecision(resp, approved);
        else if (resp && resp.alert === 'text' && resp.phone) text.sendDecision(resp, approved);
    } catch (e) {
        res.json({ error: e });
    }
};

const getUser = async (req, res) => {
    try {
        const resp = await userModel.getUserById(req.user.id);
        res.json(resp);
    } catch (e) {
        res.json({ error: e }).status(404);
    }
};

module.exports = {
    addPost,
    getUpcomingPosts,
    getArchivePosts,
    deletePost,
    getPost,
    updatePost,
    getEditReqs,
    handleEditReq,
    getUser
};
