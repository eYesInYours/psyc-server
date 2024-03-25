'use strict';

const express = require('express')
const UserHandler = require('../controllers/user/index') 
const router = express.Router();

router.post('/login', UserHandler.login);
router.get('/info', UserHandler.getUserInfo);

 
module.exports = router;