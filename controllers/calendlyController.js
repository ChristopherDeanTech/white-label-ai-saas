const crypto = require("crypto");
const calendlyClient = require("../config/calendlyClient");
const Booking = require("../models/Booking");

const getCurrentUser = async (req, res) => {
try {
const response = await calendlyClient.get("/users/me");
res.json(response.data);
} catch (error) {
console.error("Calendly user error:", error.response?.data || error.message);
res.status(500).json({
success: false,
message: "Failed to fetch Calendly user"
});
}
};

const getEventTypes = async (req, res) => {
try {
const userResponse = await calendlyClient.get("/users/me");
const userUri = userResponse.data.resource.uri;

const response = await calendlyClient.get("/event_types", {
params: {
user: userUri,
sort: "name:asc"
}
});

res.json(response.data);
} catch (error) {
console.error("Calendly event types error:", error.response?.data || error.message);
res.status(500).json({
success: false,
message: "Failed to fetch event types"
});
}
};

const getScheduledEvents = async (req, res) => {
try {
const userResponse = await calendlyClient.get("/users/me");
const userUri = userResponse.data.resource.uri;

const response = await calendlyClient.get("/scheduled_events", {
params: {
user: userUri,
count: 20,
sort: "start_time:desc"
}
});

res.json(response.data);
} catch (error) {
console.error("Calendly scheduled events error:", error.response?.data || error.message);
res.status(500).json({
success: false,
message: "Failed to fetch scheduled events"
});
}
};

const verifyCalendlySignature = (req, res, next) => {
try {
const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;

if (!signingKey) return next();

const signatureHeader = req.headers["calendly-webhook-signature"];
if (!signatureHeader) {
return res.status(401).json({ success: false, message: "Missing signature" });
}

const signatureParts = signatureHeader.split(",");
const v1Part = signatureParts.find(part => part.trim().startsWith("v1="));
const receivedSignature = v1Part ? v1Part.split("=")[1] : null;

if (!receivedSignature) {
return res.status(401).json({ success: false, message: "Invalid signature header" });
}

const expectedSignature = crypto
.createHmac("sha256", signingKey)
.update(req.rawBody)
.digest("hex");

if (expectedSignature !== receivedSignature) {
return res.status(401).json({ success: false, message: "Invalid webhook signature" });
}

next();
} catch (error) {
console.error("Calendly signature error:", error.message);
res.status(500).json({ success: false, message: "Signature verification failed" });
}
};

const handleCalendlyWebhook = async (req, res) => {
try {
const { event, payload } = req.body;

if (event === "invitee.created") {
await Booking.findOneAndUpdate(
{ inviteeUri: payload?.uri || "" },
{
calendlyEvent: payload?.event_type || "Calendly Booking",
inviteeName: payload?.name || "",
inviteeEmail: payload?.email || "",
scheduledEventUri: payload?.scheduled_event?.uri || "",
inviteeUri: payload?.uri || "",
status: "scheduled",
rawPayload: payload
},
{ upsert: true, new: true }
);
}

if (event === "invitee.canceled") {
await Booking.findOneAndUpdate(
{ inviteeUri: payload?.uri || "" },
{
status: "canceled",
rawPayload: payload
},
{ new: true }
);
}

res.json({ success: true, message: "Webhook received" });
} catch (error) {
console.error("Calendly webhook error:", error.message);
res.status(500).json({ success: false, message: "Webhook failed" });
}
};

module.exports = {
getCurrentUser,
getEventTypes,
getScheduledEvents,
verifyCalendlySignature,
handleCalendlyWebhook
};
