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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const client = await clientPromise;
    const db = client.db();
    
    const query = activeOnly ? { active: true } : {};
    const testimonials = await db.collection("testimonials").find(query).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Database error in GET testimonials:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, role, content, rating, active } = body;
    
    if (!name || !content) {
      return NextResponse.json({ error: "Name and content are required" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    const newTestimonial = {
      name,
      role: role || "",
      content,
      rating: rating ? parseInt(rating, 10) : 5,
      active: active !== undefined ? active : true,
      createdAt: new Date()
    };
    
    const result = await db.collection("testimonials").insertOne(newTestimonial);
    return NextResponse.json({ ...newTestimonial, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Database error in POST testimonial:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { _id, name, role, content, rating, active } = body;
    
    if (!_id) {
      return NextResponse.json({ error: "Testimonial ID is required" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    const updateData = {
      name,
      role: role || "",
      content,
      rating: parseInt(rating, 10),
      active,
      updatedAt: new Date()
    };
    
    const result = await db.collection("testimonials").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Testimonial updated successfully" });
  } catch (error) {
    console.error("Database error in PUT testimonial:", error);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "Testimonial ID is required" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection("testimonials").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Database error in DELETE testimonial:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
