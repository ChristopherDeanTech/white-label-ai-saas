const { generateAIResponse } = require('../services/aiservice');

exports.askAI = async (req, res) => {
try {
const { prompt } = req.body;

if (!prompt) {
return res.status(400).json({ message: 'Prompt is required' });
}

const response = await generateAIResponse(prompt);

res.json({ response });
} catch (error) {
res.status(500).json({ message: error.message });
}
};
