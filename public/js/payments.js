document.addEventListener("DOMContentLoaded", () => {
const buttons = document.querySelectorAll("[data-plan]");

console.log("Stripe buttons found:", buttons.length);

buttons.forEach((button) => {
button.addEventListener("click", async (e) => {
e.preventDefault();
e.stopPropagation();

const plan = button.dataset.plan;
const originalText = button.textContent;

console.log("Clicked plan:", plan);

button.textContent = "Loading...";
button.style.pointerEvents = "none";

try {
const response = await fetch("/api/payments/create-checkout-session", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ plan })
});

const data = await response.json();
console.log("Checkout response:", data);

if (!response.ok) {
throw new Error(data.message || "Failed to start checkout.");
}

if (!data.url) {
throw new Error("No checkout URL returned.");
}

window.location.href = data.url;
} catch (error) {
console.error("Stripe checkout error:", error);
alert(error.message || "Something went wrong starting checkout.");
button.textContent = originalText;
button.style.pointerEvents = "auto";
}
});
});
});