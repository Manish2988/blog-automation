const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
};

// Map your categories to search keywords
const categorySearchMap = {
  lamp: "study lamp",
  stand: "mobile stand",
  extension: "extension board",
  earbuds: "bluetooth earbuds"
};

async function fetchProducts(searchTerm) {
  const url = `https://www.amazon.in/s?k=${encodeURIComponent(searchTerm)}`;

  const res = await axios.get(url, { headers: HEADERS });
  const $ = cheerio.load(res.data);

  const products = [];

  $(".s-result-item").each((i, el) => {
    if (products.length >= 5) return;

    const title = $(el).find("h2 span").text().trim();
    const image = $(el).find("img.s-image").attr("src");
    const link = $(el).find("a.a-link-normal").attr("href");

    if (title && image && link && link.includes("/dp/")) {
      const asinMatch = link.match(/\/dp\/([A-Z0-9]{10})/);

      if (asinMatch) {
        const asin = asinMatch[1];

        products.push({
          title,
          price: "Check Amazon",
          rating: "4.0",
          image,
          url: `https://www.amazon.in/dp/${asin}`
        });
      }
    }
  });

  return products;
}

async function updateProducts() {
  const productData = {};

  for (const category in categorySearchMap) {
    const searchTerm = categorySearchMap[category];

    console.log("Fetching:", searchTerm);

    try {
      const products = await fetchProducts(searchTerm);
      productData[category] = products;
    } catch (err) {
      console.log("Error fetching", category, err.message);
      productData[category] = [];
    }
  }

  fs.writeFileSync("products.json", JSON.stringify(productData, null, 2));

  console.log("✅ products.json updated");
}

updateProducts();
