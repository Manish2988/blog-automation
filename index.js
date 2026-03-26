const { google } = require("googleapis");
if (!process.env.CLIENT_ID) {
  throw new Error("Missing CLIENT_ID");
}
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);
console.log("REFRESH_TOKEN:", process.env.REFRESH_TOKEN ? "Present" : "Missing");
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
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
    <h1>Best Gadgets Under ₹1000 in India (2026)</h1>

<p>
Looking for the <strong>best gadgets under ₹1000</strong>? We’ve handpicked the most useful, high-rated and value-for-money products available right now.
</p>

<p><em>Disclaimer: This post contains affiliate links. Prices may vary.</em></p>

<hr/>

<h2>🔥 Top Picks (Quick List)</h2>
<ul>
  <li>✔ Wireless Earbuds – Best for music lovers</li>
  <li>✔ Portable Blender – Best for kitchen use</li>
  <li>✔ LED Desk Lamp – Best for study/work</li>
</ul>

<hr/>

<h2>🛍️ Detailed Reviews</h2>
  `;

  products.forEach((p, i) => {
    html += `
      <h2>${i + 1}. ${p.title}</h2>
      <h3>1. PRODUCT_NAME</h3>

<img src="IMAGE_URL" alt="PRODUCT_NAME" width="250"/>

<p><strong>Price:</strong> ₹PRICE</p>
<p><strong>Rating:</strong> ⭐RATING</p>

<p>
This PRODUCT_NAME is one of the best options in this price range. It is ideal for users who want VALUE_USE_CASE.
</p>

<h4>✅ Pros</h4>
<ul>
  <li>Good build quality</li>
  <li>High customer ratings</li>
  <li>Affordable price</li>
</ul>

<h4>❌ Cons</h4>
<ul>
  <li>Limited stock sometimes</li>
  <li>Basic features</li>
</ul>

<p>
<a href="AFFILIATE_LINK" target="_blank">
👉 Check Latest Price on Amazon
</a>
</p>

<hr/>
    `;
  });

  html += `
    <h2>🤔 Buying Guide</h2>

<p>
When choosing gadgets under ₹1000, consider:
</p>

<ul>
  <li>✔ Build quality</li>
  <li>✔ Customer ratings</li>
  <li>✔ Warranty & brand trust</li>
</ul>

<h2>🏁 Final Verdict</h2>

<p>
If you want the best overall, go for <strong>TOP_PRODUCT</strong>. 
For budget buyers, <strong>SECOND_PRODUCT</strong> is a great choice.
</p>
  `;

  return html;
}

// 🚀 Create Draft Post
async function createDraft() {
  const blogId = process.env.BLOG_ID;

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
