import { Suspense } from 'react';
import clientPromise from '@/lib/mongodb';
import ProductsClient from './ProductsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'All Products & Best Deals | BahijaPets',
  description: 'Browse our fully curated selection of high-tech gadgets, home & kitchen essentials, and fitness gear. Read expert reviews and find the best prices.',
};

export default async function ProductsPage() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch all products, categories, and subcategories from the database
    const products = await db.collection("products").find({}).toArray();
    const categories = await db.collection("categories").find({}).toArray();
    const subcategories = await db.collection("subcategories").find({}).toArray();

    // Serialize MongoDB documents for Client Components
    const serializedProducts = products.map(p => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt ? p.createdAt.toISOString() : null
    }));

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

    return (
      <Suspense fallback={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--text-secondary)' }}>
          Loading products...
        </div>
      }>
        <ProductsClient 
          initialProducts={serializedProducts} 
          categories={serializedCategories} 
          subcategories={serializedSubcategories}
        />
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading products page:", error);
    // Render with empty arrays if database connection fails
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsClient initialProducts={[]} categories={[]} subcategories={[]} />
      </Suspense>
    );
  }
}
