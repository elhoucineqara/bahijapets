import clientPromise from '@/lib/mongodb';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  metadataBase: new URL('https://BahijaPets.vercel.app'),
  title: 'BahijaPets - Best Pet Deals & Expert Reviews',
  description: 'Discover a rigorous selection of the best pet products available online. Expert reviews, pros/cons, and real-time updated prices.',
};

export default async function Home() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch categories, subcategories, products, articles, and testimonials
    const categories = await db.collection("categories").find({}).toArray();
    const subcategories = await db.collection("subcategories").find({}).toArray();
    const products = await db.collection("products").find({}).toArray();
    const articles = await db.collection("articles").find({}).sort({ createdAt: -1 }).limit(3).toArray();
    const testimonials = await db.collection("testimonials").find({ active: true }).sort({ createdAt: -1 }).toArray();

    // Serialize documents for Client Component
    const serializedCategories = categories.map(c => ({
      ...c,
      _id: c._id.toString(),
      createdAt: c.createdAt ? c.createdAt.toISOString() : null
    }));

    const serializedSubcategories = subcategories.map(s => ({
      ...s,
      _id: s._id.toString(),
      categoryId: s.categoryId ? s.categoryId.toString() : null,
      createdAt: s.createdAt ? s.createdAt.toISOString() : null
    }));

    // Filter to only Hot Deals for the homepage grid and serialize
    const hotDeals = products.filter(p => p.isHotDeal);
    const serializedHotDeals = hotDeals.map(p => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt ? p.createdAt.toISOString() : null
    }));

    // Serialize articles
    const serializedArticles = articles.map(a => ({
      ...a,
      _id: a._id.toString(),
      createdAt: a.createdAt ? a.createdAt.toISOString() : null
    }));

    // Serialize testimonials
    const serializedTestimonials = testimonials.map(t => ({
      ...t,
      _id: t._id.toString(),
      createdAt: t.createdAt ? t.createdAt.toISOString() : null
    }));

    return (
      <HomeClient 
        categories={serializedCategories} 
        subcategories={serializedSubcategories}
        hotDeals={serializedHotDeals} 
        latestArticles={serializedArticles}
        testimonials={serializedTestimonials}
      />
    );
  } catch (error) {
    console.error("Database connection error in Home page:", error);
    // Render with empty arrays if database connection fails
    return <HomeClient categories={[]} subcategories={[]} hotDeals={[]} latestArticles={[]} testimonials={[]} />;
  }
}
