import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const { productId, action } = await request.json();

    if (!productId || !action || !ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    if (action !== 'view' && action !== 'click') {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const updateField = action === 'view' ? 'views' : 'clicks';

    await db.collection("products").updateOne(
      { _id: new ObjectId(productId) },
      { $inc: { [updateField]: 1 } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
