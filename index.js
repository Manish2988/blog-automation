const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  "process.env.CLIENT_ID",
  "process.env.CLIENT_SECRET",
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: ""
});

const blogger = google.blogger({
  version: "v3",
  auth: oauth2Client
});

// 🔥 MOCK PRODUCTS (replace later with Amazon API)
const products = [
  {
    title: "Wireless Earbuds",
    price: "999",
    rating: "4.3",
    image: "https://via.placeholder.com/150",
    link: "https://amazon.in/dp/example?tag=yourtag-21"
  },
  {
    title: "Portable Blender",
    price: "799",
    rating: "4.2",
    image: "https://via.placeholder.com/150",
    link: "https://amazon.in/dp/example?tag=yourtag-21"
  }
];

// 🧠 Generate Blog HTML
function generateContent(products) {
  let html = `
    <h1>Best Budget Gadgets Under ₹1000 (2026)</h1>
    <p>Looking for useful gadgets under budget? Here are top picks.</p>
  `;

  products.forEach((p, i) => {
    html += `
      <h2>${i + 1}. ${p.title}</h2>
      <img src="${p.image}" />
      <p><strong>Price:</strong> ₹${p.price}</p>
      <p><strong>Rating:</strong> ⭐${p.rating}</p>

      <ul>
        <li>✔ Value for money</li>
        <li>✔ Good ratings</li>
        <li>❌ Limited stock</li>
      </ul>

      <a href="${p.link}">👉 Buy on Amazon</a>
      <hr/>
    `;
  });

  html += `
    <h2>Final Verdict</h2>
    <p>These are the best gadgets under ₹1000 currently available.</p>
  `;

  return html;
}

// 🚀 Create Draft Post
async function createDraft() {
  const blogId = "YOUR_BLOG_ID";

  const res = await blogger.posts.insert({
    blogId: blogId,
    requestBody: {
      title: "Best Gadgets Under ₹1000 (2026)",
      content: generateContent(products),
      status: "DRAFT"
    }
  });

  console.log("Draft Created:", res.data.url);
}

createDraft();
