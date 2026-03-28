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


const fs = require("fs");

function getNextKeyword() {
  let index = 0;

  if (fs.existsSync("keywordIndex.txt")) {
    index = parseInt(fs.readFileSync("keywordIndex.txt"));
  }

  const keyword = keywords[index % keywords.length];

  fs.writeFileSync("keywordIndex.txt", index + 1);

  return keyword;
}

function generateTitle(keyword) {
  return `${keyword} (2026 Guide)`;
}

const productPool = {
  "lamp": [
    {
      title: "Wipro LED Study Lamp",
      price: "899",
      rating: "4.3",
      image: "https://m.media-amazon.com/images/I/61lamp.jpg",
      link: "https://amazon.in/dp/XXXXX?tag=yourtag-21"
    }
  ],

  "earbuds": [
    {
      title: "boAt Airdopes 141",
      price: "1299",
      rating: "4.2",
      image: "https://m.media-amazon.com/images/I/61earbuds.jpg",
      link: "https://amazon.in/dp/YYYYY?tag=yourtag-21"
    }
  ]
};

function getCategory(keyword) {
  if (keyword.includes("lamp")) return "lamp";
  if (keyword.includes("earbuds")) return "earbuds";
  return "lamp";
}

function getProductsForKeyword(keyword) {
  const category = getCategory(keyword);
  return productPool[category] || [];
}

function generateComparisonTable(products) {
  let table = `
    <h2>📊 Quick Comparison</h2>
    <table border="1" cellpadding="8" cellspacing="0">
      <tr>
        <th>Product</th>
        <th>Price</th>
        <th>Rating</th>
        <th>Action</th>
      </tr>
  `;

  products.forEach((p) => {
    table += `
      <tr>
        <td>${p.title}</td>
        <td>₹${p.price}</td>
        <td>⭐${p.rating}</td>
        <td>
          <a href="${p.link}" target="_blank">
          Check Price
          </a>
        </td>
      </tr>
    `;
  });

  table += `</table><br/>`;

  return table;
}

function generateProsCons(keyword) {
  const prosPool = [
    "Good value for money",
    "Highly rated by users",
    "Suitable for daily use",
    "Compact and easy to use",
    "Energy efficient"
  ];

  const consPool = [
    "Limited advanced features",
    "Stock may run out quickly",
    "Not ideal for heavy usage",
    "Basic design"
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

// 🧠 Generate Blog HTML
function generateContent(keyword, products) {
  let html = `
    <h1>${keyword} (2026 Guide)</h1>
    <p>${getRandom(introLines)}</p>
    <p><em>Disclaimer: This post contains affiliate links. Prices may vary.</em></p>

    <h2>🔥 Top Picks</h2>
    <ul>
  `;
html += generateComparisonTable(products);
  products.forEach(p => {
    html += `<li>${p.title}</li>`;
  });

  html += `</ul><hr/><h2>🛍️ Detailed Reviews</h2>`;

  products.forEach((p, i) => {
  const badge = i === 0 
    ? `<p><strong>🏆 Best Overall Choice</strong></p>` 
    : "";

  html += `
    <h3>${i + 1}. ${p.title}</h3>

    ${badge}

    <img src="${p.image}" width="250"/>

    <p><strong>Price:</strong> ₹${p.price}</p>
    <p><strong>Rating:</strong> ⭐${p.rating}</p>

    ${generateHumanDescription(p, keyword)}

    ${generateProsCons(keyword)}

    <a href="${p.link}" target="_blank">
      👉 Check Latest Price (Limited Deal)
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
async function createDraft(keyword) { 
  const keyword = keywords[new Date().getDate() % keywords.length];

  const title = generateTitle(keyword);
  const products = getProductsForKeyword(keyword);
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
 
  function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function getKeyword(indexOffset = 0) {
  const baseIndex = new Date().getDate();
  return keywords[(baseIndex + indexOffset) % keywords.length];
}

async function runMultiplePosts() {
  for (let i = 0; i < 2; i++) {
    const keyword = getKeyword(i);
    await createDraft(keyword);
    await delay(5000);
  }
}
  
runMultiplePosts();
