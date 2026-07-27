import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import ArticleClient from './ArticleClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const client = await clientPromise;
    const db = client.db();
    const article = await db.collection("articles").findOne({ slug });

    if (!article) {
      return {
        title: 'Article Not Found - BahijaPets',
        description: 'The requested article could not be found.'
      };
    }

    const metaTitle = article.seoTitle || `${article.title} | BahijaPets Blog`;
    const metaDescription = article.seoDescription || article.content.substring(0, 155) + '...';

    return {
      title: metaTitle,
      description: metaDescription,
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: `https://BahijaPets.vercel.app/blog/${article.slug}`,
        siteName: 'BahijaPets',
        images: article.image ? [{ url: article.image }] : [],
        type: 'article',
      }
    };
  } catch (error) {
    return { title: 'Blog - BahijaPets' };
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;

  try {
    const client = await clientPromise;
    const db = client.db();

    // Increment views directly server side
    await db.collection("articles").updateOne({ slug }, { $inc: { views: 1 } });

    const article = await db.collection("articles").findOne({ slug });

    if (!article) {
      return <ArticleClient article={null} relatedProducts={[]} />;
    }

    // Fetch related products or fallback to hot deals
    let relatedProducts = [];
    if (article.relatedProducts && article.relatedProducts.length > 0) {
      const productIds = article.relatedProducts.map(id => {
        try { return new ObjectId(id); } catch (e) { return null; }
      }).filter(Boolean);

      if (productIds.length > 0) {
        relatedProducts = await db.collection("products")
          .find({ _id: { $in: productIds } })
          .toArray();
      }
    }
    
    // Fallback if no specific products are related
    if (relatedProducts.length === 0) {
      relatedProducts = await db.collection("products")
        .find({ isHotDeal: true })
        .sort({ createdAt: -1 })
        .limit(3)
        .toArray();
    }

    const serializedArticle = {
      ...article,
      _id: article._id.toString(),
      createdAt: article.createdAt ? article.createdAt.toISOString() : null,
      updatedAt: article.updatedAt ? article.updatedAt.toISOString() : null
    };

    const serializedProducts = relatedProducts.map(p => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt ? p.createdAt.toISOString() : null
    }));

    return <ArticleClient article={serializedArticle} relatedProducts={serializedProducts} />;
  } catch (error) {
    console.error("Error loading article page:", error);
    return <ArticleClient article={null} relatedProducts={[]} />;
  }
}
