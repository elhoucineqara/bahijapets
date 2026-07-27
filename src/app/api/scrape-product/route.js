import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { isAuthorized } from '@/lib/auth';

function resolveRedirect(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(res.headers.location);
      } else {
        resolve(url);
      }
    }).on('error', reject);
  });
}

async function resolveUrl(url, depth = 0) {
  if (depth > 3) return url;
  try {
    const nextUrl = await resolveRedirect(url);
    if (nextUrl !== url) {
      return resolveUrl(nextUrl, depth + 1);
    }
  } catch (e) {
    // Ignore error
  }
  return url;
}

async function fetchPage(url) {
  // Option 2: Use ScraperAPI if the API key is configured (for Vercel deployment)
  const scraperApiKey = process.env.SCRAPER_API_KEY;
  if (scraperApiKey) {
    console.log("Using ScraperAPI for fetching:", url);
    const scraperUrl = `http://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(url)}`;
    const response = await fetch(scraperUrl);
    if (!response.ok) {
      throw new Error(`ScraperAPI returned status ${response.status}`);
    }
    return await response.text();
  }

  // Option 1: Direct Fetch (works well locally, but may get blocked on Vercel)
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

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      }
    };
    https.get(options, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
        fileStream.on('error', (err) => {
          fs.unlink(destPath, () => {});
          reject(err);
        });
      } else {
        reject(new Error(`Status code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

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

function parseRating(ratingText) {
  if (!ratingText) return 5.0;
  const match = ratingText.match(/(\d+(?:\.\d+)?)/);
  if (match) {
    const val = parseFloat(match[1]);
    if (val >= 1 && val <= 5) return val;
  }
  return 5.0;
}

function getHighResUrl(url) {
  return url.replace(/\._AC_[A-Za-z0-9,_]+\.(jpg|png|gif|jpeg)/g, '._AC_SL1500_.$1');
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const { url, downloadImages } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const resolvedUrl = await resolveUrl(url);
    const html = await fetchPage(resolvedUrl);

    if (html.includes('api-services-support@') || html.includes('robot check') || html.includes('Robot Check')) {
      return NextResponse.json({ error: "Blocked by store bot protection. Please try again." }, { status: 503 });
    }

    const $ = cheerio.load(html);

    // Title
    const title = $('#productTitle').text().trim();
    if (!title) {
      return NextResponse.json({ error: "Failed to parse product title. Ensure the URL is a valid product page." }, { status: 400 });
    }

    // Price
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
    
    // Additional fallbacks for different Amazon layouts
    if (!priceText) priceText = $('#corePriceDisplay_desktop_feature_div .a-price .a-offscreen').first().text().trim();
    if (!priceText) priceText = $('#priceblock_ourprice').first().text().trim();
    if (!priceText) priceText = $('#priceblock_dealprice').first().text().trim();
    if (!priceText) priceText = $('.a-color-price').first().text().trim();
    if (!priceText) priceText = $('.a-price').first().text().trim();

    const price = parsePrice(priceText);
    console.log("Scraping price -> offscreenPrice:", offscreenPrice, "| priceText:", priceText, "| final parsed price:", price);
    console.log("Scraping price -> offscreenPrice:", offscreenPrice, "| priceText:", priceText, "| final parsed price:", price);

    // Rating
    const ratingText = $('#acrPopover .a-color-base').first().text().trim() || $('span.a-icon-alt').first().text().trim();
    const rating = parseRating(ratingText);

    // Features
    const features = [];
    $('#feature-bullets ul li span.a-list-item').each((i, el) => {
      const txt = $(el).text().trim();
      if (txt && !txt.includes('Make sure this fits')) {
        features.push(txt);
      }
    });

    // Image Extraction
    let imgUrls = [];

    // 1. From #landingImage dynamic attributes
    const landingImage = $('#landingImage');
    if (landingImage.length && landingImage.attr('data-a-dynamic-image')) {
      try {
        const imgJson = JSON.parse(landingImage.attr('data-a-dynamic-image'));
        Object.keys(imgJson).forEach(u => {
          const highRes = getHighResUrl(u);
          if (!imgUrls.includes(highRes)) imgUrls.push(highRes);
        });
      } catch (e) {
        // Ignore JSON error
      }
    }

    // 2. From script tags
    $('script').each((i, el) => {
      const scriptHtml = $(el).html();
      if (scriptHtml && scriptHtml.includes('colorImages')) {
        const matches = scriptHtml.match(/"hiRes":"(https:\/\/[^"]+)"/g);
        if (matches) {
          matches.forEach(m => {
            const matchUrl = m.match(/"hiRes":"([^"]+)"/);
            if (matchUrl) {
              const highRes = getHighResUrl(matchUrl[1]);
              if (!imgUrls.includes(highRes)) imgUrls.push(highRes);
            }
          });
        }
        const largeMatches = scriptHtml.match(/"large":"(https:\/\/[^"]+)"/g);
        if (largeMatches) {
          largeMatches.forEach(m => {
            const matchUrl = m.match(/"large":"([^"]+)"/);
            if (matchUrl) {
              const highRes = getHighResUrl(matchUrl[1]);
              if (!imgUrls.includes(highRes)) imgUrls.push(highRes);
            }
          });
        }
      }
    });

    // If no images found, try fallback selectors
    if (imgUrls.length === 0 && landingImage.attr('src')) {
      imgUrls.push(getHighResUrl(landingImage.attr('src')));
    }

    // Filter out invalid/spinner images
    imgUrls = imgUrls.filter(u => u && !u.includes('spinner') && !u.includes('transparent-pixel'));

    let finalImage = imgUrls[0] || '';
    let finalImages = [...imgUrls];

    // Download images locally if requested
    if (downloadImages && imgUrls.length > 0) {
      const productSlug = slugify(title.substring(0, 50));
      const publicDir = path.join(process.cwd(), 'public', 'images', 'products', productSlug);

      try {
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }

        const downloadedPaths = [];
        for (let i = 0; i < Math.min(imgUrls.length, 10); i++) {
          const ext = imgUrls[i].match(/\.(jpg|png|gif|jpeg)/i)?.[0] || '.jpg';
          const filename = `image-${i + 1}${ext}`;
          const destPath = path.join(publicDir, filename);
          
          try {
            await downloadImage(imgUrls[i], destPath);
            downloadedPaths.push(`/images/products/${productSlug}/${filename}`);
          } catch (e) {
            console.error(`Failed to download image ${imgUrls[i]}:`, e);
          }
        }

        if (downloadedPaths.length > 0) {
          finalImage = downloadedPaths[0];
          finalImages = downloadedPaths;
        }
      } catch (dirError) {
        console.error("Directory or download error:", dirError);
      }
    }

    // Product Description Extraction
    let description = $('#productDescription').text().trim() || $('#productDescription p').text().trim();
    if (!description && features.length > 0) {
      const usefulFeatures = features.filter(f => f.length > 30);
      description = usefulFeatures.slice(0, 3).join('\n\n');
    }
    if (!description) {
      description = `Review and details for ${title}`;
    }

    // Category from Breadcrumbs
    const breadcrumbs = [];
    $('#wayfinding-breadcrumbs_feature_div ul li span.a-list-item a').each((i, el) => {
      breadcrumbs.push($(el).text().trim());
    });
    const category = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1] : '';

    // SEO Generation
    const seoTitle = title ? `Buy ${title.substring(0, 50)} Online - BahijaPets` : '';
    const seoDescription = description ? (description.length > 150 ? description.substring(0, 147) + '...' : description) : '';
    
    const ignoreWords = ['and', 'or', 'the', 'with', 'for', 'a', 'an', 'in', 'on', 'at', 'to', 'of', 'is', 'it'];
    const keywordsSet = new Set();
    if (title) {
        title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).forEach(word => {
            if (word.length > 2 && !ignoreWords.includes(word)) {
                keywordsSet.add(word);
            }
        });
    }
    const seoKeywords = Array.from(keywordsSet).slice(0, 10).join(', ');

    return NextResponse.json({
      title,
      price,
      rating,
      features,
      image: finalImage,
      images: finalImages,
      description,
      affiliateUrl: resolvedUrl,
      category,
      seoTitle,
      seoDescription,
      seoKeywords
    });

  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json({ error: "An error occurred while scraping the product: " + error.message }, { status: 500 });
  }
}
