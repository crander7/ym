const express = require('express');
const apiCtrl = require('./../controllers/apiController');

const router = new express.Router();

router.get('/test', apiCtrl.test);
router.get('/getUpcomingPosts', apiCtrl.getUpcomingPosts);
router.get('/getArchivePosts', apiCtrl.getArchivePosts);

router.post('/addPost', apiCtrl.addPost);

router.delete('/deletePost', apiCtrl.deletePost);

module.exports = router;
