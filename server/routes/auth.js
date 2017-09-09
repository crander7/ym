const express = require('express');
const authControl = require('./../controllers/authController');

const router = new express.Router();

router.post('/signup', authControl.signUp);
router.post('/login', authControl.login);

module.exports = router;
