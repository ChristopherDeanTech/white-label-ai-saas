const axios = require("axios");

const calendlyClient = axios.create({
baseURL: "https://api.calendly.com",
headers: {
Authorization: `Bearer ${process.env.CALENDLY_TOKEN}`,
"Content-Type": "application/json"
}
});

module.exports = calendlyClient;
