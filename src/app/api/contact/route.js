import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { isAuthorized } from '@/lib/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContactBody(body) {
  const { name, email, subject, message } = body;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return { error: 'All fields are required.' };
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return { error: 'Please enter a valid email address.' };
  }

  if (message.trim().length < 10) {
    return { error: 'Message must be at least 10 characters.' };
  }

  if (name.trim().length > 100 || subject.trim().length > 200 || message.trim().length > 5000) {
    return { error: 'One or more fields exceed the maximum length.' };
  }

  return {
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    },
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = validateContactBody(body);

    if (validation.error) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const contact = {
      ...validation.data,
      read: false,
      createdAt: new Date(),
    };

    const result = await db.collection('contacts').insertOne(contact);

    return NextResponse.json(
      { success: true, message: 'Your message has been sent successfully.', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact POST error:', error);
    return NextResponse.json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
  }
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const messages = await db
      .collection('contacts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Contact GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages.' }, { status: 500 });
  }
}
