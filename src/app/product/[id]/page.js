import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  if (!ObjectId.isValid(id)) {
    return {
      title: 'Product Not Found - BahijaPets',
      description: 'The requested product could not be found.'
    };
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });

    if (!product) {
      return {
        title: 'Product Not Found - BahijaPets',
        description: 'The requested product could not be found.'
      };
    }

    const metaTitle = product.seoTitle ? product.seoTitle : `${product.title} | BahijaPets Reviews`;
    const metaDescription = product.seoDescription ? product.seoDescription : product.description.substring(0, 155) + '...';

    return {
      title: metaTitle,
      description: metaDescription,
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: `https://BahijaPets.vercel.app/product/${product._id}`,
        siteName: 'BahijaPets',
        images: [{ url: product.image, alt: product.title }],
        locale: 'en_US',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: [product.image],
      },
      alternates: {
        canonical: `https://qarapets.vercel.app/product/${product._id}`
      }
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: 'Product Reviews - BahijaPets'
    };
  }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return <ProductDetailClient product={null} relatedProducts={[]} />;
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });

    if (!product) {
      return <ProductDetailClient product={null} relatedProducts={[]} />;
    }

    // Fetch up to 3 related products in the same category, excluding the current product
    const relatedProducts = await db.collection("products")
      .find({
        categorySlug: product.categorySlug,
        _id: { $ne: new ObjectId(id) }
      })
      .limit(3)
      .toArray();

    // Serialize MongoDB documents (convert ObjectId to String, dates to ISO strings)
    const serializedProduct = {
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt ? product.createdAt.toISOString() : null
    };

    const serializedRelatedProducts = relatedProducts.map(p => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt ? p.createdAt.toISOString() : null
    }));

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      image: product.images || [product.image],
      description: product.description,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: `https://qarapets.vercel.app/product/${product._id}`
      },
      aggregateRating: product.rating ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        bestRating: '5',
        ratingCount: 154 // Fallback rating count for richer snippets
      } : undefined
    };

    return (
      <>
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} 
        />
        <ProductDetailClient
          product={serializedProduct}
          relatedProducts={serializedRelatedProducts}
        />
      </>
    );
  } catch (error) {
    console.error("Error loading product page:", error);
    return <ProductDetailClient product={null} relatedProducts={[]} />;
  }
}
