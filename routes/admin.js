'use strict';

const express = require('express')
const AdminHandler = require('../controllers/admin/index') 
const router = express.Router();
const Check = require('../middlewares/check')

router.get('/list', Check.checkAdmin, AdminHandler.list);
router.put('/update', Check.checkAdmin, AdminHandler.update);
router.post('/add', Check.checkAdmin, AdminHandler.add);
router.delete('/del/:id', Check.checkAdmin, AdminHandler.del);

 
module.exports = router;