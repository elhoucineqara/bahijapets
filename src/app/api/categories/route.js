import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';

// Helper to check if the request is authorized
function isAuthorized(request) {
  const sessionCookie = request.cookies.get('admin_session')?.value;
  if (!sessionCookie) return false;

  const adminPassword = process.env.ADMIN_PASSWORD || "BahijaPets2026!";
  const sessionSecret = process.env.SESSION_SECRET || "default_secret_string";

  const expectedToken = crypto
    .createHmac('sha256', sessionSecret)
    .update(adminPassword)
    .digest('hex');

  return sessionCookie === expectedToken;
}

// Default seed catalogs
const seedCatalogs = [
  {
    name: "Dog Essentials",
    description: "Premium food, toys, beds, and accessories for dogs.",
    slug: "dog-essentials"
  },
  {
    name: "Cat Trees & Toys",
    description: "Everything your cat needs to play and scratch.",
    slug: "cat-trees"
  },
  {
    name: "Pet Tech",
    description: "Smart feeders, cameras, and automated care.",
    slug: "pet-tech"
  }
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    let categories = await db.collection("categories").find({}).toArray();
    
    // Migration: If we find old French catalogs, clear them to re-seed in English
    const hasFrenchCatalogs = categories.some(c => c.slug === 'maison-cuisine' || c.name === 'Maison & Cuisine');
    if (hasFrenchCatalogs) {
      console.log("French categories detected. Clearing categories and products to re-seed in English...");
      await db.collection("categories").deleteMany({});
      await db.collection("products").deleteMany({});
      categories = [];
    }
    
    // Seed catalogs if empty (removed to allow empty catalogs)
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Database error in GET categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, parentSlug } = body;
    
    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }
    
    // Generate URL-friendly slug
    const slug = name
      .toLowerCase()
      .normalize('NFD') // remove accents
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
      
    const client = await clientPromise;
    const db = client.db();
    
    // Check if slug already exists
    const existing = await db.collection("categories").findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "A category with a similar name already exists." }, { status: 400 });
    }
    
    const newCatalog = {
      name,
      description: description || "",
      slug,
      parentSlug: parentSlug || null,
      createdAt: new Date()
    };
    
    const result = await db.collection("categories").insertOne(newCatalog);
    return NextResponse.json({ ...newCatalog, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Database error in POST category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
