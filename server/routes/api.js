const express = require('express');
const apiCtrl = require('./../controllers/apiController');

const router = new express.Router();

router.get('/getUpcomingPosts', apiCtrl.getUpcomingPosts);
router.get('/getArchivePosts', apiCtrl.getArchivePosts);
router.get('/getPost/:id', apiCtrl.getPost);

router.post('/addPost', apiCtrl.addPost);
router.post('/auth', apiCtrl.checkPassword);

router.put('/updatePost', apiCtrl.updatePost);

router.delete('/deletePost', apiCtrl.deletePost);

module.exports = router;
