const postModel = require('./../models/postModel');
const userModel = require('./../models/userModel');
const email = require('./../utils/email');
const text = require('./../utils/text');
const redisModel = require('./../models/redisModel');

const getUpcomingPosts = async (req, res) => {
    try {
        const resp = await postModel.getUpcomingPosts();
        res.json(resp);
    } catch (e) {
        res.json({ error: e });
        email.sendErrorReport(e, 'getUpcomingPosts');
    }
};

const getArchivePosts = async (req, res) => {
    try {
        const resp = await postModel.getArchivePosts();
        res.json(resp);
    } catch (e) {
        res.json({ error: e });
        email.sendErrorReport(e, 'getArchivePosts');
    }
};

const addPost = async (req, res) => {
    try {
        await postModel.addPost(req.body);
        res.json({ success: 'Post added to db' });
    } catch (e) {
        res.json({ error: e });
        email.sendErrorReport(e, 'addPost');
    }
};

const deletePost = async (req, res) => {
    try {
        await postModel.deletePost(req.body.id);
        res.json({ success: 'post deleted' });
    } catch (e) {
        res.json({ error: e });
        email.sendErrorReport(e, 'deletePost');
    }
};

const getPost = async (req, res) => {
    try {
        const resp = await postModel.getPost(req.params.id);
        res.json(resp);
    } catch (e) {
        res.json({ error: e });
        email.sendErrorReport(e, 'getPost');
    }
};

const updatePost = async (req, res) => {
    try {
        await postModel.updatePost(req.body);
        res.json({ success: true });
    } catch (e) {
        res.json({ error: e });
        email.sendErrorReport(e, 'updatePost');
    }
};

const getEditReqs = async (req, res) => {
    try {
        const resp = await userModel.getEditReqs();
        res.json(resp);
    } catch (e) {
        res.json({ error: e });
        email.sendErrorReport(e, 'getEditReqs');
    }
};

const handleEditReq = async (req, res) => {
    let approved = false;
    let error = false;
    if (req.body.approved) approved = true;
    try {
        const resp = await userModel.updateEditReq(req.body.id, approved);
        if (approved) await redisModel.deleteToken(req.body.id);
        if (resp && resp.alerts === 'email' && resp.email) email.sendDecision(resp, approved);
        else if (resp && resp.alerts === 'text' && resp.phone) text.sendDecision(resp, approved);
    } catch (e) {
        error = e;
    }
    if (!error) res.json({ success: 'It worked' });
    else {
        res.json({ success: false });
        email.sendErrorReport(error, 'handleEditReq');
    }
};

const getUser = async (req, res) => {
    try {
        const resp = await userModel.getUserById(req.userId);
        const children = await userModel.getChildren(req.userId);
        if (children[0]) resp.kids = children;
        else resp.kids = [];
        res.json(resp);
    } catch (e) {
        res.json({ error: e });
        email.sendErrorReport(e, 'getUser');
    }
};

const updateUser = async (req, res) => {
    try {
        await userModel.updateUser(req.body);
        if (req.body.edit_req) email.editReq(req.body);
        res.json({ success: true });
    } catch (e) {
        res.json({ error: e });
        email.sendErrorReport(e, 'updateUser');
    }
};

const addTag = async (req, res) => {
    try {
        await postModel.addTag(req.body);
        res.json({ success: true });
    } catch (e) {
        res.json({ error: e });
        email.sendErrorReport(e, 'addTag');
    }
};

const deleteAccount = async (req, res) => {
    const id = req.params.id;
    try {
        await userModel.deleteAccount(id);
        res.json({ success: true });
    } catch (e) {
        res.json({ error: e });
        email.sendErrorReport(e, 'deleteAccount');
    }
};

const setParent = async (req, res) => {
    try {
        await userModel.setParent(req.body.val, req.body.id);
        res.json({ success: true });
    } catch (e) {
        res.json({ error: e });
        email.sendErrorReport(e, 'setParent');
    }
};

const addKid = async (req, res) => {
    try {
        const data = await userModel.addKid(req.body);
        res.json({ success: true, kid: data[0] });
    } catch (e) {
        res.json({ error: e });
        email.sendErrorReport(e, 'addKid');
    }
};

const sendGroupMessage = async (req, res) => {
    try {
        const users = req.body.users;
        if (users) {
            users.map((user) => { // eslint-disable-line
                if (user.alerts === 'text') {
                    if (user.phone) text.spam(req.body.message, user.phone);
                } else if (user.email) email.spam(req.body.message, user.email);
            });
        }
        res.json({ success: true });
    } catch (e) {
        res.json({ error: e });
        email.sendErrorReport(e, 'sendGroupMessage');
    }
};

const getAllUsers = async (req, res) => {
    try {
        const data = await userModel.getAllUsers4Message();
        res.json({ success: true, users: data });
    } catch (e) {
        res.json({ error: e });
        email.sendErrorReport(e, 'getAllUsers4Message');
    }
};

const userCheckin = async (req, res) => {
    try {
        const resp = await postModel.userCheckin(req.body.query);
        res.json({ success: true, first: resp });
    } catch (e) {
        res.json({ error: e });
        email.sendErrorReport(e, 'userCheckin');
    }
};

const childCheckin = async (req, res) => {
    try {
        const resp = await postModel.childCheckin(req.body.query);
        res.json({ success: true, first: resp });
    } catch (e) {
        res.json({ error: e });
        email.sendErrorReport(e, 'childCheckin');
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
    getUser,
    updateUser,
    addTag,
    deleteAccount,
    setParent,
    addKid,
    sendGroupMessage,
    getAllUsers,
    userCheckin,
    childCheckin
};
