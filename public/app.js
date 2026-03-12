const checkoutForm = document.getElementById("checkoutForm");
const message = document.getElementById("message");

checkoutForm.addEventListener("submit", async (e) => {
e.preventDefault();

const customerName = document.getElementById("customerName").value.trim();
const customerEmail = document.getElementById("customerEmail").value.trim();

message.textContent = "Creating checkout session...";

try {
const response = await fetch("/api/stripe/create-checkout-session", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
customerName,
customerEmail
})
});

const data = await response.json();

if (data.success && data.url) {
window.location.href = data.url;
return;
}

message.textContent = "Could not create checkout session.";
} catch (error) {
console.error(error);
message.textContent = "Something went wrong.";
}
});