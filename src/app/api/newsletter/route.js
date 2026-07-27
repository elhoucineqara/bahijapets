import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if email already exists
    const existing = await db.collection("subscribers").findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email is already subscribed." }, { status: 409 });
    }

    await db.collection("subscribers").insertOne({
      email,
      createdAt: new Date(),
      status: 'active'
    });

    return NextResponse.json({ success: true, message: "Successfully subscribed!" });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Subscription failed. Please try again later." }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const subscribers = await db.collection("subscribers").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(subscribers);
  } catch (error) {
    console.error("Newsletter fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}
