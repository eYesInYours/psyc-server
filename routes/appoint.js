'use strict';

const express = require('express')
const AppointHandler = require('../controllers/appoint/index') 
const router = express.Router();
const Check = require('../middlewares/check')

router.get('/list', AppointHandler.list);

 
module.exports = router;