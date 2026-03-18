const form = document.getElementById("hubspotLeadForm");
const formStatus = document.getElementById("formStatus");

if (form) {
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (e) => {
e.preventDefault();

if (submitBtn) {
submitBtn.disabled = true;
submitBtn.textContent = "Sending...";
}

formStatus.textContent = "Submitting your message...";
formStatus.className = "form-status form-status-loading";

const formData = new FormData(form);

const payload = {
firstname: formData.get("firstname"),
lastname: formData.get("lastname"),
email: formData.get("email"),
phone: formData.get("phone"),
company: formData.get("company"),
website: formData.get("website"),
message: formData.get("message")
};

try {
const response = await fetch("/api/hubspot/lead", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(payload)
});

const result = await response.json();

if (!response.ok) {
throw new Error(result.message || "Submission failed.");
}

formStatus.textContent = "Success! Your message was sent and saved to our CRM.";
formStatus.className = "form-status form-status-success";
form.reset();
formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
} catch (error) {
formStatus.textContent = error.message || "Something went wrong. Please try again.";
formStatus.className = "form-status form-status-error";
formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
} finally {
if (submitBtn) {
submitBtn.disabled = false;
submitBtn.textContent = "Send Message";
}
}
});
}