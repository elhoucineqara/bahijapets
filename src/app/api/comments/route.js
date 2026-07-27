import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entityId'); // Can be productId or articleId
    const entityType = searchParams.get('entityType'); // 'product' or 'article'
    const status = searchParams.get('status'); // 'approved', 'pending', etc. Optional.

    const client = await clientPromise;
    const db = client.db();

    let filter = {};
    if (entityId) filter.entityId = entityId;
    if (entityType) filter.entityType = entityType;
    if (status) filter.status = status;

    const comments = await db.collection("comments").find(filter).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(comments);
  } catch (error) {
    console.error("GET comments error:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { entityId, entityType, entityTitle, authorName, text } = await request.json();

    if (!entityId || !entityType || !authorName || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const commentDoc = {
      entityId,
      entityType,
      entityTitle,
      authorName,
      text,
      status: 'approved', // Auto-approve for simplicity, can be 'pending' for strict moderation
      createdAt: new Date(),
    };

    const result = await db.collection("comments").insertOne(commentDoc);

    return NextResponse.json({ success: true, message: "Comment posted successfully!", data: result }, { status: 201 });
  } catch (error) {
    console.error("POST comment error:", error);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
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

    const result = await db.collection("comments").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("DELETE comment error:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
