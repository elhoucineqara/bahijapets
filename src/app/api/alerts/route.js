import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    const client = await clientPromise;
    const db = client.db();

    let filter = {};
    if (productId) {
      filter.productId = productId;
    }

    const alerts = await db.collection("alerts").find(filter).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(alerts);
  } catch (error) {
    console.error("GET alerts error:", error);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { productId, productTitle, email, currentPrice } = await request.json();

    if (!productId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if this email already set an alert for this product
    const existingAlert = await db.collection("alerts").findOne({ productId, email });
    if (existingAlert) {
      return NextResponse.json({ message: "You already have an active alert for this product." }, { status: 400 });
    }

    const alertDoc = {
      productId,
      productTitle,
      email,
      targetPrice: currentPrice, // The price at the time they subscribed
      active: true,
      createdAt: new Date(),
    };

    const result = await db.collection("alerts").insertOne(alertDoc);

    return NextResponse.json({ success: true, message: "Alert created successfully!", data: result }, { status: 201 });
  } catch (error) {
    console.error("POST alert error:", error);
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Valid ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("alerts").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Alert deleted successfully" });
  } catch (error) {
    console.error("DELETE alert error:", error);
    return NextResponse.json({ error: "Failed to delete alert" }, { status: 500 });
  }
}
