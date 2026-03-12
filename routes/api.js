const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const { askAI } = require('../controllers/aicontroller');

router.post('/ask', authMiddleware, askAI);

module.exports = router;
