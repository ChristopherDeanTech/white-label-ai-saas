const OpenAI = require('openai');

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

async function generateAIResponse(prompt) {
const completion = await openai.chat.completions.create({
model: 'gpt-4.1-mini',
messages: [
{
role: 'system',
content: 'You are a helpful AI assistant for a business SaaS platform.'
},
{
role: 'user',
content: prompt
}
]
});

return completion.choices[0].message.content;
}

module.exports = { generateAIResponse };