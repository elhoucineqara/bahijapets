const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const coll = db.collection('catalogs');
    
    // Assign old categories as subcategories of the new animal categories
    await coll.updateOne({ slug: 'dog-essentials' }, { $set: { parentSlug: 'dogs' } });
    await coll.updateOne({ slug: 'cat-trees' }, { $set: { parentSlug: 'cats' } });
    
    // Optional: if they want Pet Tech to be a subcategory of others, but usually it's a main category. 
    // For now, just fix dog-essentials and cat-trees.
    
    console.log("Updated category hierarchy successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
