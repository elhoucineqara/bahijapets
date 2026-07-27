import clientPromise from '@/lib/mongodb';
import BlogClient from './BlogClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Expert Guides & Tech Reviews | BahijaPets',
  description: 'In-depth analysis, top lists, and buying guides to help you make the best choice.',
};

export default async function BlogPage() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const articles = await db.collection("articles").find({}).sort({ createdAt: -1 }).toArray();
    
    const serializedArticles = articles.map(a => ({
      ...a,
      _id: a._id.toString(),
      createdAt: a.createdAt ? a.createdAt.toISOString() : null
    }));

    return <BlogClient articles={serializedArticles} />;
  } catch (error) {
    console.error("Error loading blog page:", error);
    return <BlogClient articles={[]} />;
  }
}
