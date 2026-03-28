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
const AMAZON_TAG = "manish2988-21";

function generateAffiliateLink(url) {
  if (!url) return "#";

  // If URL already has parameters
  if (url.includes("?")) {
    return `${url}&tag=${AMAZON_TAG}`;
  }

  // If no parameters
  return `${url}?tag=${AMAZON_TAG}`;
}

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



function getCategory(keyword) {
  if (keyword.includes("lamp")) return "lamp";
  if (keyword.includes("stand")) return "stand";
  if (keyword.includes("extension")) return "extension";
  if (keyword.includes("earbuds")) return "earbuds";
  return "lamp";
}

function getProductsForKeyword(keyword) {
  const category = getCategory(keyword);
  return productPool[category] || [];
}

const productPool = {

  lamp: [
    {
      title: "Wipro Garnet LED Desk Light",
      price: "1329",
      rating: "4.3",
      image: "https://m.media-amazon.com/images/I/61Z4Qw9k3LL._SX679_.jpg",
      url: "https://amzn.in/d/00MR8QZV"
    },
    {
      title: "Philips Air LED Desk Light",
      price: "649",
      rating: "4.4",
      image: "https://m.media-amazon.com/images/I/71eQwWz7ZKL._SX679_.jpg",
      url: "https://amzn.in/d/08iT8LN1"
    },
    {
      title: "Havells Glare LED Table Lamp",
      price: "1099",
      rating: "4.2",
      image: "https://m.media-amazon.com/images/I/61lamp123._SX679_.jpg",
      url: "https://amzn.in/d/0aTR5Fwg"
    }
  ],

  stand: [
    {
      title: "STRIFF Adjustable Mobile Stand",
      price: "199",
      rating: "4.3",
      image: "https://m.media-amazon.com/images/I/61a1XwS3ZkL._SX679_.jpg",
      url: "https://amzn.in/d/0aNBw2y1"
    },
    {
      title: "Portronics MODESK Mobile Holder",
      price: "249",
      rating: "4.2",
      image: "https://m.media-amazon.com/images/I/61stand123._SX679_.jpg",
      url: "https://www.amazon.in/dp/B08ABCDE12"
    }
  ],

  extension: [
    {
      title: "Portronics Power Plate 10 Extension Board",
      price: "399",
      rating: "4.5",
      image: "https://m.media-amazon.com/images/I/61power123._SX679_.jpg",
      url: "https://www.amazon.in/dp/B08345XYZ"
    },
    {
      title: "Havells 6A 4 Socket Extension Board",
      price: "349",
      rating: "4.4",
      image: "https://m.media-amazon.com/images/I/61ext123._SX679_.jpg",
      url: "https://www.amazon.in/dp/B07ABCDE34"
    }
  ],

  earbuds: [
    {
      title: "boAt Airdopes 141 Bluetooth Earbuds",
      price: "1299",
      rating: "4.2",
      image: "https://m.media-amazon.com/images/I/61KNJav3S9L._SX679_.jpg",
      url: "https://www.amazon.in/dp/B09XYZ567"
    },
    {
      title: "Boult Audio Z40 True Wireless Earbuds",
      price: "999",
      rating: "4.1",
      image: "https://m.media-amazon.com/images/I/61ear123._SX679_.jpg",
      url: "https://www.amazon.in/dp/B08LMNOPQ"
    }
  ]
};


function generateComparisonTable(products) {
  let table = `
    <h2>📊 Quick Comparison</h2>
    <div style="overflow-x:auto;">
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: left;">
      <tr>
        <th>Product</th>
        <th>Price</th>
        <th>Rating</th>
        <th>Action</th>
      </tr>
  `;

  products.forEach((p) => {
    const link = generateAffiliateLink(p.url); // ✅ IMPORTANT

    table += `
      <tr>
        <td>
          <img src="${p.image}" width="60" style="vertical-align: middle; margin-right: 8px;" />
          ${p.title}
        </td>
        <td>₹${p.price}</td>
        <td>⭐${p.rating}</td>
        <td>
          <a href="${link}" target="_blank" style="color: blue; font-weight: bold;">
            👉 View on Amazon
          </a>
        </td>
      </tr>
    `;
  });

  table += `
    </table>
    </div>
    <br/>
  `;

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



function sortProducts(products) {
  return products.sort((a, b) => {
    // First compare rating (higher is better)
    if (parseFloat(b.rating) !== parseFloat(a.rating)) {
      return parseFloat(b.rating) - parseFloat(a.rating);
    }

    // If rating same → lower price wins
    return parseFloat(a.price) - parseFloat(b.price);
  });
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
const link = generateAffiliateLink(p.url);
  html += `
    <h3>${i + 1}. ${p.title}</h3>

    ${badge}

    <img src="${p.image}" width="250"/>

    <p><strong>Price:</strong> ₹${p.price}</p>
    <p><strong>Rating:</strong> ⭐${p.rating}</p>

    ${generateHumanDescription(p, keyword)}

    ${generateProsCons(keyword)}

    <a href="${link}" target="_blank">
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
  const title = generateTitle(keyword);
  let products = getProductsForKeyword(keyword);
  const content = generateContent(keyword, products);

// ✅ Sort products
products = sortProducts(products);
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

/*async function runMultiplePosts() {
  for (let i = 0; i < 2; i++) {
    const keyword = getKeyword(i);
    await createDraft(keyword);
    await delay(5000);
  }
}*/

  async function runThreePosts() {
  for (let i = 0; i < 3; i++) {
    const keyword = getKeyword(i);

    let products = getProductsForKeyword(keyword);

    products = sortProducts(products);

    const content = generateContent(keyword, products);

    await blogger.posts.insert({
      blogId: process.env.BLOG_ID,
      isDraft: true,
      requestBody: {
        title: generateTitle(keyword),
        content: content,
        labels: ["study setup", "amazon finds"]
      }
    });

    console.log("Created post:", keyword);

    await new Promise(r => setTimeout(r, 5000));
  }
  }

runThreePosts();
//runMultiplePosts();
