'use strict';

const express = require('express')
const ClassroomHandler = require('../controllers/classroom/index')
const router = express.Router();
const Check = require('../middlewares/check')

router.get('/list', Check.checkAdmin, ClassroomHandler.list);
router.get('/search', ClassroomHandler.search);
router.put('/update', Check.checkAdmin, ClassroomHandler.update);
router.post('/add', Check.checkAdmin, ClassroomHandler.add);
router.delete('/del/:id', Check.checkAdmin, ClassroomHandler.del);

 
module.exports = router;