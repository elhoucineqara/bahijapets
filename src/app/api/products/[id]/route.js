import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { isAuthorized } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Database error in GET product by ID:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  // Security Check
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, price, category, catalogSlug, rating, image, images, affiliateUrl, features, pros, cons, isHotDeal, seoTitle, seoDescription, seoKeywords } = body;
    
    const client = await clientPromise;
    const db = client.db();
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category !== undefined) updateData.category = category;
    if (catalogSlug !== undefined) updateData.catalogSlug = catalogSlug;
    if (rating !== undefined) updateData.rating = parseFloat(rating);
    if (image !== undefined) updateData.image = image;
    if (images !== undefined) updateData.images = Array.isArray(images) ? images : [];
    if (affiliateUrl !== undefined) updateData.affiliateUrl = affiliateUrl;
    if (features !== undefined) updateData.features = Array.isArray(features) ? features : [];
    if (pros !== undefined) updateData.pros = Array.isArray(pros) ? pros : [];
    if (cons !== undefined) updateData.cons = Array.isArray(cons) ? cons : [];
    if (isHotDeal !== undefined) updateData.isHotDeal = !!isHotDeal;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
    if (seoKeywords !== undefined) updateData.seoKeywords = seoKeywords;
    
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Database error in PUT:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  // Security Check
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Database error in DELETE:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
