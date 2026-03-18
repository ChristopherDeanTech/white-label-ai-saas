const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const HUBSPOT_BASE_URL = "https://api.hubapi.com";

if (!HUBSPOT_ACCESS_TOKEN) {
console.warn("Missing HUBSPOT_ACCESS_TOKEN in .env");
}

async function hubspotRequest(endpoint, method = "GET", body = null) {
const options = {
method,
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`
}
};

if (body) {
options.body = JSON.stringify(body);
}

const response = await fetch(`${HUBSPOT_BASE_URL}${endpoint}`, options);
const data = await response.json().catch(() => ({}));

if (!response.ok) {
const message =
data?.message ||
data?.category ||
`HubSpot request failed with status ${response.status}`;

throw new Error(message);
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
properties: ["email", "firstname", "lastname", "phone", "company"],
limit: 1
};

const data = await hubspotRequest("/crm/v3/objects/contacts/search", "POST", payload);

if (data.results && data.results.length > 0) {
return data.results[0];
}

return null;
}

async function createContact(contactData) {
const payload = {
properties: {
email: contactData.email,
firstname: contactData.firstname || "",
lastname: contactData.lastname || "",
phone: contactData.phone || "",
company: contactData.company || "",
website: contactData.website || "",
lifecyclestage: contactData.lifecyclestage || "lead",
hs_lead_status: contactData.hs_lead_status || "NEW"
}
};

return await hubspotRequest("/crm/v3/objects/contacts", "POST", payload);
}

async function updateContactById(contactId, contactData) {
const payload = {
properties: {
firstname: contactData.firstname || "",
lastname: contactData.lastname || "",
phone: contactData.phone || "",
company: contactData.company || "",
website: contactData.website || "",
lifecyclestage: contactData.lifecyclestage || "lead",
hs_lead_status: contactData.hs_lead_status || "NEW"
}
};

return await hubspotRequest(`/crm/v3/objects/contacts/${contactId}`, "PATCH", payload);
}

async function createNoteForContact(contactId, noteBody) {
const notePayload = {
properties: {
hs_note_body: noteBody,
hs_timestamp: new Date().toISOString()
},
associations: [
{
to: {
id: contactId
},
types: [
{
associationCategory: "HUBSPOT_DEFINED",
associationTypeId: 202
}
]
}
]
};

return await hubspotRequest("/crm/v3/objects/notes", "POST", notePayload);
}

async function upsertLead(contactData) {
const existing = await findContactByEmail(contactData.email);

let contact;

if (existing) {
contact = await updateContactById(existing.id, contactData);
} else {
contact = await createContact(contactData);
}

return contact;
}

module.exports = {
findContactByEmail,
createContact,
updateContactById,
createNoteForContact,
upsertLead
};
