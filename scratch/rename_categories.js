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
    console.log("Connected to MongoDB.");
    
    const db = client.db();
    const coll = db.collection('catalogs');
    
    await coll.updateOne({ slug: 'for-dogs' }, { $set: { name: 'Dogs', slug: 'dogs' } });
    await coll.updateOne({ slug: 'for-cats' }, { $set: { name: 'Cats', slug: 'cats' } });
    await coll.updateOne({ slug: 'small-pets' }, { $set: { name: 'Mice' } }); 

    const prodColl = db.collection('products');
    await prodColl.updateMany({ catalogSlug: 'for-dogs' }, { $set: { catalogSlug: 'dogs' } });
    await prodColl.updateMany({ catalogSlug: 'for-cats' }, { $set: { catalogSlug: 'cats' } });

    await coll.updateMany({ parentSlug: 'for-dogs' }, { $set: { parentSlug: 'dogs' } });
    await coll.updateMany({ parentSlug: 'for-cats' }, { $set: { parentSlug: 'cats' } });

    console.log("Renamed categories successfully.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

run();
