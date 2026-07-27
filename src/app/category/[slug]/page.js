import clientPromise from '@/lib/mongodb';
import CatalogClient from './CatalogClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const client = await clientPromise;
    const db = client.db();
    const category = await db.collection("categories").findOne({ slug });

    if (!category) {
      return {
        title: 'Collection Not Found - BahijaPets',
        description: 'The requested collection could not be found.'
      };
    }

    return {
      title: `Best ${category.name} - Reviews & Buyer's Guide | BahijaPets`,
      description: category.description || `Browse the best recommendations and reviews for ${category.name}.`,
      openGraph: {
        title: `Best ${category.name} - Reviews & Buyer's Guide | BahijaPets`,
        description: category.description,
      }
    };
  } catch (error) {
    console.error("Error generating category metadata:", error);
    return {
      title: 'Collections - BahijaPets'
    };
  }
}

export default async function CatalogPage({ params }) {
  const { slug } = await params;

  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch the category
    const category = await db.collection("categories").findOne({ slug });

    if (!category) {
      return <CatalogClient category={null} products={[]} />;
    }

    // Fetch products belonging to this category
    const products = await db.collection("products")
      .find({ categorySlug: slug })
      .toArray();

    // Serialize MongoDB documents for Client Components
    const serializedCatalog = {
      ...category,
      _id: category._id.toString(),
      createdAt: category.createdAt ? category.createdAt.toISOString() : null
    };

    const serializedProducts = products.map(p => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt ? p.createdAt.toISOString() : null
    }));

    return (
      <CatalogClient
        category={serializedCatalog}
        products={serializedProducts}
      />
    );
  } catch (error) {
    console.error("Error loading category page:", error);
    return <CatalogClient category={null} products={[]} />;
  }
}
