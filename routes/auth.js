const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const {
signup,
login,
getProfile
} = require('../controllers/authcontroller');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
