const axios = require("axios");

async function getEventTypes() {
const response = await axios.get(
"https://api.calendly.com/event_types",
{
headers: {
Authorization: `Bearer ${process.env.CALENDLY_TOKEN}`
}
}
);

return response.data;
}

module.exports = { getEventTypes };