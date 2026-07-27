const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

async function run() {
  if (!uri) {
    console.error("No MONGODB_URI found.");
    return;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    
    // 1. Rename 'catalogs' collection to 'categories' if it exists
    const collections = await db.listCollections({ name: 'catalogs' }).toArray();
    if (collections.length > 0) {
      console.log("Renaming catalogs collection to categories...");
      await db.collection('catalogs').rename('categories');
    } else {
      console.log("No catalogs collection found (maybe already renamed?).");
    }

    // 2. Update all products to use categorySlug instead of catalogSlug
    console.log("Updating products...");
    const productsColl = db.collection('products');
    await productsColl.updateMany(
      { catalogSlug: { $exists: true } },
      { $rename: { "catalogSlug": "categorySlug" } }
    );
    
    console.log("Migration complete.");
    
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.close();
  }
}

run();
