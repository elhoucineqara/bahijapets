const https = require('https');
const cheerio = require('cheerio');

function parsePrice(priceText) {
  if (!priceText) return 0;
  
  const isMad = priceText.toUpperCase().includes('MAD') || priceText.toUpperCase().includes('DH');
  
  let cleaned = priceText.replace(/[^\d.,]/g, '').trim();
  if (cleaned.includes(',') && cleaned.includes('.')) {
    cleaned = cleaned.replace(/,/g, '');
  } else if (cleaned.includes(',')) {
    const parts = cleaned.split(',');
    if (parts.length === 2 && parts[1].length === 2) {
      cleaned = parts[0] + '.' + parts[1];
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  }
  let parsed = parseFloat(cleaned);
  let finalPrice = isNaN(parsed) ? 0 : parsed;
  
  if (isMad && finalPrice > 0) {
    finalPrice = parseFloat((finalPrice / 10).toFixed(2));
  }
  
  return finalPrice;
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const url = 'https://www.amazon.com/Purina-Pro-Plan-Essentials-Formula/dp/B001VIY7T6/';
  console.log("Fetching", url);
  const html = await fetchPage(url);
  const $ = cheerio.load(html);
  
  let priceText = '';
  const offscreenPrice = $('.a-price .a-offscreen').first().text().trim();
  if (offscreenPrice) {
    priceText = offscreenPrice;
  } else {
    const priceWhole = $('.a-price-whole').first().text().trim();
    const priceFraction = $('.a-price-fraction').first().text().trim();
    if (priceWhole) {
      priceText = priceWhole + (priceFraction ? '.' + priceFraction : '');
    }
  }
  
  // Try alternative price selectors if empty
  if (!priceText) {
    priceText = $('#priceblock_ourprice').text().trim() || $('#corePriceDisplay_desktop_feature_div .a-price .a-offscreen').text().trim();
  }
  
  const price = parsePrice(priceText);
  
  console.log("Extracted Price Text:", priceText);
  console.log("Parsed Price:", price);
  console.log("corePriceDisplay HTML:", $('#corePriceDisplay_desktop_feature_div').html());
  console.log("Title:", $('title').text());
}

run();
