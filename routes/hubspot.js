const express = require("express");
const router = express.Router();

const HUBSPOT_BASE_URL = "https://api.hubapi.com";
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

async function hubspotRequest(endpoint, method = "GET", body = null) {
const response = await fetch(`${HUBSPOT_BASE_URL}${endpoint}`, {
method,
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`
},
body: body ? JSON.stringify(body) : undefined
});

const data = await response.json().catch(() => ({}));

if (!response.ok) {
throw new Error(data.message || `HubSpot request failed with status ${response.status}`);
}

return data;
}

async function findContactByEmail(email) {
const payload = {
filterGroups: [
{
filters: [
{
propertyName: "email",
operator: "EQ",
value: email
}
]
}
],
properties: ["email", "firstname", "lastname", "phone", "company", "website"],
limit: 1
};

const data = await hubspotRequest("/crm/v3/objects/contacts/search", "POST", payload);
return data.results && data.results.length ? data.results[0] : null;
}

async function createContact(contactData) {
return hubspotRequest("/crm/v3/objects/contacts", "POST", {
properties: {
email: contactData.email,
firstname: contactData.firstname || "",
lastname: contactData.lastname || "",
phone: contactData.phone || "",
company: contactData.company || "",
website: contactData.website || "",
lifecyclestage: "lead"
}
});
}

async function updateContact(contactId, contactData) {
return hubspotRequest(`/crm/v3/objects/contacts/${contactId}`, "PATCH", {
properties: {
firstname: contactData.firstname || "",
lastname: contactData.lastname || "",
phone: contactData.phone || "",
company: contactData.company || "",
website: contactData.website || ""
}
});
}

async function createNoteForContact(contactId, messageBody, contactData) {
const noteText = `
New website inquiry received.

Name: ${contactData.firstname} ${contactData.lastname}
Email: ${contactData.email}
Phone: ${contactData.phone || "N/A"}
Company: ${contactData.company || "N/A"}
Website: ${contactData.website || "N/A"}

Message:
${messageBody || "No message provided."}
`.trim();

return hubspotRequest("/crm/v3/objects/notes", "POST", {
properties: {
hs_note_body: noteText,
hs_timestamp: new Date().toISOString()
},
associations: [
{
to: { id: contactId },
types: [
{
associationCategory: "HUBSPOT_DEFINED",
associationTypeId: 202
}
]
}
]
});
}

router.post("/lead", async (req, res) => {
try {
const { firstname, lastname, email, phone, company, website, message } = req.body;

if (!firstname || !lastname || !email) {
return res.status(400).json({
ok: false,
message: "First name, last name, and email are required."
});
}

const lead = {
firstname: String(firstname).trim(),
lastname: String(lastname).trim(),
email: String(email).trim().toLowerCase(),
phone: phone ? String(phone).trim() : "",
company: company ? String(company).trim() : "",
website: website ? String(website).trim() : ""
};

const existingContact = await findContactByEmail(lead.email);

let contact;
if (existingContact) {
contact = await updateContact(existingContact.id, lead);
} else {
contact = await createContact(lead);
}

if (message && String(message).trim()) {
try {
await createNoteForContact(contact.id, String(message).trim(), lead);
} catch (noteError) {
console.warn("Contact saved but note creation failed:", noteError.message);
}
}

return res.status(200).json({
ok: true,
message: "Lead sent to HubSpot successfully.",
contactId: contact.id
});
} catch (error) {
console.error("HubSpot route error:", error.message);
return res.status(500).json({
ok: false,
message: error.message || "Failed to send lead to HubSpot."
});
}
});

module.exports = router;
