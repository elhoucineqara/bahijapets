import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { isAuthorized } from '@/lib/auth';

// POST: Increment visitor count
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const country = body.country || 'Unknown';

    const client = await clientPromise;
    const db = client.db();

    // Increment the visitor count and country count in a singleton document
    const updateQuery = {
      $inc: { 
        totalVisitors: 1,
        [`countries.${country}`]: 1
      }
    };

    await db.collection('stats').updateOne(
      { _id: 'global_stats' },
      updateQuery,
      { upsert: true }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Stats POST error:', error);
    return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 });
  }
}

// GET: Fetch visitor and contact stats for Admin Dashboard
export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch visitor stats
    const statsDoc = await db.collection('stats').findOne({ _id: 'global_stats' });
    const totalVisitors = statsDoc?.totalVisitors || 0;
    const countries = statsDoc?.countries || {};

    // Fetch contact stats
    const totalContacts = await db.collection('contacts').countDocuments({});
    const unreadContacts = await db.collection('contacts').countDocuments({ read: false });

    return NextResponse.json({
      visitors: totalVisitors,
      countries: countries,
      contacts: {
        total: totalContacts,
        unread: unreadContacts
      }
    });
  } catch (error) {
    console.error('Stats GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats.' }, { status: 500 });
  }
}
