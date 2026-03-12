const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');

router.get('/link', authMiddleware, async (req, res) => {
try {
res.json({ url: process.env.CALENDLY_LINK });
} catch (error) {
res.status(500).json({ message: error.message });
}
});

module.exports = router;
