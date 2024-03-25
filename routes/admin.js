'use strict';

const express = require('express')
const AdminHandler = require('../controllers/admin/index') 
const router = express.Router();

router.get('/list', AdminHandler.list);

 
module.exports = router;