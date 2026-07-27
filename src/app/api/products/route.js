import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { seedProducts } from '@/lib/seedProducts';
import { isAuthorized } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const catalogSlug = searchParams.get('catalog');

    const client = await clientPromise;
    const db = client.db();

    const totalProducts = await db.collection("products").countDocuments({});
    const productsWithCatalog = await db.collection("products").countDocuments({ catalogSlug: { $exists: true } });

    if (totalProducts > 0 && productsWithCatalog === 0) {
      console.log("Old schema detected. Migrating products to multi-catalog schema...");
      await db.collection("products").deleteMany({});
    }

    let query = {};
    if (catalogSlug) {
      // Find if there are any subcategories for this catalog
      const subCatalogs = await db.collection("catalogs").find({ parentSlug: catalogSlug }).toArray();
      const targetSlugs = [catalogSlug, ...subCatalogs.map(c => c.slug)];
      
      query = { catalogSlug: { $in: targetSlugs } };
    }

    const products = await db.collection("products").find(query).toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Database connection error in GET products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const { title, description, price, catalogSlug, image, images, affiliateUrl, rating, features, pros, cons, isHotDeal, seoTitle, seoDescription, seoKeywords } = await request.json();

    const missingFields = [];
    if (!title) missingFields.push("Product Title");
    if (!price && price !== 0) missingFields.push("Price");
    if (!catalogSlug) missingFields.push("Destination Catalog");
    if (!image) missingFields.push("Image URL");
    if (!affiliateUrl) missingFields.push("Product Affiliate Link");

    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const newProduct = {
      title,
      description: description || "",
      price: parseFloat(price),
      catalogSlug,
      rating: parseFloat(rating) || 5.0,
      image,
      images: Array.isArray(images) && images.length > 0 ? images : [image],
      affiliateUrl,
      features: Array.isArray(features) ? features : [],
      pros: Array.isArray(pros) ? pros : [],
      cons: Array.isArray(cons) ? cons : [],
      isHotDeal: !!isHotDeal,
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      seoKeywords: seoKeywords || '',
      views: 0,
      clicks: 0,
      createdAt: new Date()
    };

    const result = await db.collection("products").insertOne(newProduct);
    return NextResponse.json({ ...newProduct, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Database connection error in POST product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
