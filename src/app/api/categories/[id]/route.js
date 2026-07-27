import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
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

export async function DELETE(request, { params }) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();
    
    // Find the catalog first to get its slug (so we can delete its products)
    const result = await db.collection("categories").deleteOne({ slug: id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    
    // Also delete any subcategories of this category
    await db.collection("subcategories").deleteMany({ parentSlug: id });
    
    // Update products that were linked to this category
    await db.collection("products").updateMany(
      { categorySlug: id },
      { $set: { categorySlug: "" } }
    );
    
    return NextResponse.json({ message: "Category and associated product links successfully updated." });
  } catch (error) {
    console.error("Database error in DELETE category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
