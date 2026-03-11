const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

router.post("/ai", aiController.generateAI);

module.exports = router;