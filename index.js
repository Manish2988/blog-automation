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

const keywords = [
  "Best table lamp for studying at night India",
  "Best LED study lamp under ₹1000 India",
  "Best chair for long study hours India budget",
  "Best extension board for study table India",
  "Best phone stand for online classes India",
  "Best earbuds for online classes under ₹1500 India",
  "Best study setup under ₹2000 India",
  "Amazon finds for study table India"
];

const introLines = [
  "I’ve shortlisted these based on ratings and real usability.",
  "After comparing multiple options, these stand out in this budget.",
  "These are practical picks I would personally recommend."
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateHumanDescription(p, keyword) {
  const intros = [
    `If you're searching for ${keyword.toLowerCase()}, this is a solid option.`,
    `One of the most practical choices for ${keyword.toLowerCase()} right now.`,
    `For daily use, this product stands out in this category.`
  ];

  const useCases = [
    "ideal for long study sessions",
    "great for small desks or compact spaces",
    "useful for students and work-from-home users",
    "works well for everyday usage"
  ];

  return `
    <p>${getRandom(intros)}</p>
    <p>It is ${getRandom(useCases)} and offers a good balance of price and performance.</p>
  `;
}

function getRandomKeyword() {
  let index = new Date().getDate() % keywords.length;
  const keyword = keywords[index];
  return keyword;
}

function generateTitle(keyword) {
  return `${keyword} (2026 Guide)`;
}

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
function generateContent(keyword, products) {
  let html = `
    <h1>${keyword} (2026 Guide)</h1>
    <p>${getRandom(introLines)}</p>
    <p><em>Disclaimer: This post contains affiliate links. Prices may vary.</em></p>

    <h2>🔥 Top Picks</h2>
    <ul>
  `;

  products.forEach(p => {
    html += `<li>${p.title}</li>`;
  });

  html += `</ul><hr/><h2>🛍️ Detailed Reviews</h2>`;

  products.forEach((p, i) => {
    html += `
      <h3>${i + 1}. ${p.title}</h3>
      <img src="${p.image}" width="250"/>

      <p><strong>Price:</strong> ₹${p.price}</p>
      <p><strong>Rating:</strong> ⭐${p.rating}</p>

      ${generateHumanDescription(p, keyword)}

      <h4>✅ Pros</h4>
      <ul>
        <li>Good ratings</li>
        <li>Affordable</li>
      </ul>

      <h4>❌ Cons</h4>
      <ul>
        <li>Limited stock</li>
      </ul>

      <a href="${p.link}" target="_blank">
      👉 Check Latest Price on Amazon
      </a>

      <hr/>
    `;
  });

  html += `
    <h2>🏁 Final Verdict</h2>
    <p>
    If you're looking for the best option, go for <strong>${products[0].title}</strong>.
    It provides the best balance of price and performance.
    </p>
  `;

  return html;
}


// 🚀 Create Draft Post
async function createDraft() {
  const keyword = getRandomKeyword();
  const title = generateTitle(keyword);

  const content = generateContent(keyword, products);

  const res = await blogger.posts.insert({
    blogId: process.env.BLOG_ID,
    isDraft: true,
    requestBody: {
      title: title,
      content: content,
      labels: ["study setup", "amazon finds"]
    }
  });

  console.log("Draft created for:", keyword);
}

createDraft();
