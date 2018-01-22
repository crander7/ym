const express = require('express');
const apiCtrl = require('./../controllers/apiController');
const authCheckMiddleware = require('./../middleware/authCheck');

const router = new express.Router();

/* GET Endpoints */
router.get('/getUpcomingPosts', apiCtrl.getUpcomingPosts);
router.get('/getArchivePosts', apiCtrl.getArchivePosts);
router.get('/getPost/:id', authCheckMiddleware, apiCtrl.getPost);
router.get('/getEditReqs', authCheckMiddleware, apiCtrl.getEditReqs);
router.get('/getUser', authCheckMiddleware, apiCtrl.getUser);

/* POST Endpoints */
router.post('/addPost', authCheckMiddleware, apiCtrl.addPost);
router.post('/handleEditReq', authCheckMiddleware, apiCtrl.handleEditReq);
router.post('/tags/add', authCheckMiddleware, apiCtrl.addTag);
router.post('/addKid', authCheckMiddleware, apiCtrl.addKid);

/* PUT Endpoints */
router.put('/updatePost', authCheckMiddleware, apiCtrl.updatePost);
router.put('/updateUser', authCheckMiddleware, apiCtrl.updateUser);
router.put('/setParent', authCheckMiddleware, apiCtrl.setParent);

/* DELETE Endpoints */
router.delete('/deletePost', authCheckMiddleware, apiCtrl.deletePost);
router.delete('/account/:id', authCheckMiddleware, apiCtrl.deleteAccount);

module.exports = router;
