const express = require('express');
const router = express.Router();
const { handleStripeWebhook } = require('../controllers/webhookcontroller');

router.post('/', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router;
