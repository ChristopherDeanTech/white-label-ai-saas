const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-checkout-session", authMiddleware, paymentController.createCheckoutSession);

module.exports = router;