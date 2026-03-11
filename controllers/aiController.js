const aiService = require("../services/aiService");

exports.generateAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await aiService.generateResponse(prompt);

    res.json({ result: response });

  } catch (error) {
    res.status(500).json({ error: "AI generation failed" });
  }
};