const express = require('express')
const QuestionnaireHandler = require('../controllers/questionnaire/index') 
const router = express.Router();

router.post('/create', QuestionnaireHandler.create);
router.get('/list', QuestionnaireHandler.list);

 
module.exports = router;