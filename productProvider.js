const fs = require("fs");

const productFile = "products.json";

function loadProducts() {
  if (!fs.existsSync(productFile)) {
    return {
      lamp: [],
      stand: [],
      extension: [],
      earbuds: []
    };
  }

  try {
    return JSON.parse(fs.readFileSync(productFile, "utf-8"));
  } catch {
    return {};
  }
}

function getCategory(keyword) {
  if (keyword.includes("lamp")) return "lamp";
  if (keyword.includes("stand")) return "stand";
  if (keyword.includes("extension")) return "extension";
  if (keyword.includes("earbuds")) return "earbuds";
  return "lamp";
}

function getProducts(keyword) {
  const data = loadProducts();
  const category = getCategory(keyword);

  let products = data[category] || [];

  if (!products.length) {
    return [
      {
        title: "Top Product on Amazon",
        price: "Check Amazon",
        rating: "4.0",
        image: "https://via.placeholder.com/250",
        url: "https://www.amazon.in"
      }
    ];
  }

  return products.sort(() => 0.5 - Math.random()).slice(0, 3);
}

module.exports = { getProducts };
