import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const articles = await db.collection("articles").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, slug, content, image, seoTitle, seoDescription, relatedProducts } = await request.json();
    
    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const existing = await db.collection("articles").findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "An article with this slug already exists." }, { status: 409 });
    }

    const newArticle = {
      title,
      slug,
      content,
      image: image || '',
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      relatedProducts: relatedProducts || [],
      createdAt: new Date(),
      views: 0
    };

    const result = await db.collection("articles").insertOne(newArticle);
    return NextResponse.json({ success: true, articleId: result.insertedId });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { _id, title, slug, content, image, seoTitle, seoDescription, relatedProducts } = await request.json();
    
    if (!_id || !title || !slug || !content) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check for duplicate slug
    const existing = await db.collection("articles").findOne({ slug, _id: { $ne: new ObjectId(_id) } });
    if (existing) {
      return NextResponse.json({ error: "An article with this slug already exists." }, { status: 409 });
    }

    await db.collection("articles").updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          title,
          slug,
          content,
          image,
          seoTitle,
          seoDescription,
          relatedProducts,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid article ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    await db.collection("articles").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
