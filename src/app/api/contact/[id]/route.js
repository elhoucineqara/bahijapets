import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { isAuthorized } from '@/lib/auth';

export async function DELETE(request, { params }) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Message not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Message deleted.' });
  } catch (error) {
    console.error('Contact DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete message.' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const update = {};
    if (typeof body.read === 'boolean') {
      update.read = body.read;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 });
    }

    const result = await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Message not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Message updated.' });
  } catch (error) {
    console.error('Contact PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update message.' }, { status: 500 });
  }
}
