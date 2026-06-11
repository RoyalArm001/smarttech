const payload = {
  source: "contact-page",
  language: "hy",
  page: "/contact",
  contact: "API Test · +37499123456",
  summary: [
    "Contact page request",
    "Name: API Test",
    "Phone: +37499123456",
    "Email: —",
    "",
    "Message:",
    "This is a longer automated test message for contact delivery."
  ].join("\n"),
  answers: { contact: "API Test · +37499123456" },
  _trap: ""
};

fetch("http://localhost:3000/api/request", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Origin: "http://localhost:3000",
    Referer: "http://localhost:3000/contact/"
  },
  body: JSON.stringify(payload)
})
  .then(async (response) => {
    const data = await response.json().catch(() => ({}));
    console.log("Status:", response.status);
    console.log("Body:", JSON.stringify(data, null, 2));
  })
  .catch((error) => {
    console.error("Request failed:", error.message || error);
    process.exit(1);
  });
