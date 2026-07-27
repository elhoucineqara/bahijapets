import clientPromise from '@/lib/mongodb';

export default async function sitemap() {
  const baseUrl = 'https://qarapets.vercel.app';
  
  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    }
  ];

  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Fetch products, categories, and articles
    const products = await db.collection("products").find({}).project({ id: 1, updatedAt: 1, createdAt: 1 }).toArray();
    const categories = await db.collection("categories").find({}).project({ slug: 1, createdAt: 1 }).toArray();
    const articles = await db.collection("articles").find({}).project({ slug: 1, createdAt: 1 }).toArray();

    const productUrls = products.map((product) => ({
      url: `${baseUrl}/product/${product._id}`,
      lastModified: product.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const categoryUrls = categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: category.createdAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }));

    const articleUrls = articles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...routes, { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 }, ...categoryUrls, ...productUrls, ...articleUrls];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return routes;
  }
}
