const express = require('express');
const authControl = require('./../controllers/authController');

const router = new express.Router();

router.get('/check4Token/:token', authControl.check4Token);

router.get('/fb/callback', authControl.fbCallback);
router.get('/facebook', authControl.facebook);

router.get('/google/return', authControl.googleCb);
router.get('/google', authControl.google);

router.post('/signup', authControl.localSignUp);
router.post('/login', authControl.localLogin);

module.exports = router;
