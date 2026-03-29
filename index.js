const { google } = require("googleapis");
const fs = require("fs");
const { getProducts } = require("./productProvider");

// 🔐 ENV CHECK
if (!process.env.CLIENT_ID) {
  throw new Error("Missing CLIENT_ID");
}

// 🔐 AUTH
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

const blogger = google.blogger({
  version: "v3",
  auth: oauth2Client
});

const AMAZON_TAG = "manish2988-21";

// 🔗 Affiliate link
function generateAffiliateLink(url) {
  if (!url) return "#";
  return url.includes("?")
    ? `${url}&tag=${AMAZON_TAG}`
    : `${url}?tag=${AMAZON_TAG}`;
}

// 🔑 Keywords
const keywords = [
  "Best table lamp for studying at night India",
  "Best LED study lamp under ₹1000 India",
  "Best chair for long study hours India budget",
  "Best extension board for study table India",
  "Best phone stand for online classes India",
  "Best earbuds for online classes under ₹1500 India",
  "Best study setup under ₹2000 India",
  "Amazon finds for study table India",
  "Best study lamp under ₹1000 India",
  "Best mobile stand for study table India",
  "Best earbuds for online classes under ₹1500"
];

function getCategory(keyword) {
  keyword = keyword.toLowerCase();

  if (keyword.includes("lamp")) return "lamp";
  if (keyword.includes("stand")) return "stand";
  if (keyword.includes("extension")) return "extension";
  if (keyword.includes("earbuds")) return "earbuds";
  if (keyword.includes("chair")) return "chair"; // ✅ ADD

  return "lamp";
}

// 🔁 Keyword rotation (persistent)
function getNextKeyword() {
  const file = "keywordIndex.txt";
  let index = 0;

  if (fs.existsSync(file)) {
    const val = parseInt(fs.readFileSync(file, "utf-8"));
    index = isNaN(val) ? 0 : val;
  }

  const keyword = keywords[index % keywords.length];
  fs.writeFileSync(file, (index + 1).toString());

  return keyword;
}

function generateProsCons() {
  const prosPool = [
    "Good value for money",
    "Highly rated by users",
    "Suitable for daily use",
    "Compact and easy to use",
    "Energy efficient",
    "Reliable brand"
  ];

  const consPool = [
    "Limited advanced features",
    "Not ideal for heavy usage",
    "Basic design",
    "Stock may run out quickly"
  ];

  function pickRandom(arr) {
    return arr.sort(() => 0.5 - Math.random()).slice(0, 2);
  }

  const pros = pickRandom(prosPool);
  const cons = pickRandom(consPool);

  return `
    <h4>✅ Pros</h4>
    <ul>
      ${pros.map(p => `<li>${p}</li>`).join("")}
    </ul>

    <h4>❌ Cons</h4>
    <ul>
      ${cons.map(c => `<li>${c}</li>`).join("")}
    </ul>
  `;
}
function generateIntro(keyword) {
  return `
  <p>
  Looking for <strong>${keyword.toLowerCase()}</strong>? You're in the right place.
  With so many options available on Amazon, choosing the right one can be confusing.
  </p>

  <p>
  To make it easier, we’ve shortlisted some of the <strong>top-rated and best-selling products</strong> based on real user reviews, performance, and value for money.
  </p>

  <p>
  Whether you're a student, working professional, or setting up your study space, these picks are practical, reliable, and budget-friendly.
  </p>

  <p>
  👉 Let’s quickly compare the best options available right now.
  </p>

  <p><em>Disclaimer: This post contains affiliate links. Prices may change.</em></p>
  `;
}

// 🎯 Better titles (CTR optimized)
function generateTitle(keyword) {
  const templates = [
    `Best ${keyword} (2026) – Top Picks Under Budget`,
    `${keyword} – Top 5 Picks You Shouldn’t Miss (2026)`,
    `Top ${keyword} in India (2026) – Budget to Premium`,
    `${keyword}: Best Options for Students & Daily Use`,
    `Best ${keyword} in India (2026) – Honest Review`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

// 🧠 Sort products
function sortProducts(products) {
  return products.sort((a, b) => {
    if (parseFloat(b.rating) !== parseFloat(a.rating)) {
      return parseFloat(b.rating) - parseFloat(a.rating);
    }
    return parseFloat(a.price) - parseFloat(b.price);
  });
}

// 📊 Comparison Table
function generateComparisonTable(products) {
  let table = `
  <h2>📊 Quick Comparison</h2>
  <table border="1" cellpadding="8" style="width:100%">
    <tr>
      <th>Product</th>
      <th>Price</th>
      <th>Rating</th>
      <th>Action</th>
    </tr>
  `;

  products.forEach(p => {
    const link = generateAffiliateLink(p.url);

    table += `
    <tr>
      <td>
        <a href="${link}" target="_blank">
          <img src="${p.image}" width="120"/>
        </a>
        <br/>${p.title}
      </td>
      <td>₹${p.price}</td>
      <td>⭐${p.rating}</td>
      <td>
        <a href="${link}" target="_blank">👉 View</a>
      </td>
    </tr>
    `;
  });

  table += `</table><br/>`;
  return table;
}

// 📝 Content generator
function generateContent(keyword, products) {
  let html += generateIntro(keyword);
  
  html += generateComparisonTable(products);
  html += `
  <h2>Best ${keyword} – Top Picks (2026)</h2>
  `;
  products.forEach((p, i) => {
  const link = generateAffiliateLink(p.url);

  const badge =
    i === 0
      ? `<p><strong>🏆 Best Overall Choice</strong></p>`
      : i === 1
      ? `<p><strong>💰 Best Budget Pick</strong></p>`
      : `<p><strong>✨ Good Alternative</strong></p>`;

  html += `
    <h3>${i + 1}. ${p.title}</h3>

    ${badge}

    <a href="${link}" target="_blank">
      <img src="${p.image}" width="250"/>
    </a>

    <p><strong>Price:</strong> ₹${p.price}</p>
    <p><strong>Rating:</strong> ⭐${p.rating}</p>

    ${generateProsCons()}

    <a href="${link}" target="_blank">
      👉 Check Latest Price (Limited Deal)
    </a>

    <hr/>
  `;
});

  return html;
}

// 🚀 Create draft
async function createDraft(keyword) {
  let products = getProducts(keyword);
  products = sortProducts(products);

  const content = generateContent(keyword, products);

  await blogger.posts.insert({
    blogId: process.env.BLOG_ID,
    isDraft: true,
    requestBody: {
      title: generateTitle(keyword),
      content: content,
      labels: ["amazon finds"]
    }
  });

  console.log("Draft created:", keyword);
}

// 🔁 Runner
async function runPosts(count = 1) {
  for (let i = 0; i < count; i++) {
    const keyword = getNextKeyword();
    await createDraft(keyword);
    await new Promise(r => setTimeout(r, 5000));
  }
}

runPosts(process.env.POST_COUNT || 1);
