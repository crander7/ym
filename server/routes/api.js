const express = require('express');
const apiCtrl = require('./../controllers/apiController');
const authCheckMiddleware = require('./../middleware/auth-check');

const router = new express.Router();

router.get('/getUpcomingPosts', apiCtrl.getUpcomingPosts);
router.get('/getArchivePosts', apiCtrl.getArchivePosts);
router.get('/getPost/:id', authCheckMiddleware, apiCtrl.getPost);

router.post('/addPost', authCheckMiddleware, apiCtrl.addPost);

router.put('/updatePost', authCheckMiddleware, apiCtrl.updatePost);

router.delete('/deletePost', authCheckMiddleware, apiCtrl.deletePost);

module.exports = router;
