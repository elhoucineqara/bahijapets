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
    
    console.log("Fetching subcategories...");
    const subcats = await db.collection('subcategories').find({}).toArray();
    
    let updatedCount = 0;
    for (const sub of subcats) {
      if (!sub.categoryId && sub.parentSlug) {
        const parent = await db.collection('categories').findOne({ slug: sub.parentSlug });
        if (parent) {
          await db.collection('subcategories').updateOne(
            { _id: sub._id },
            { $set: { categoryId: parent._id } }
          );
          updatedCount++;
        }
      }
    }
    
    console.log(`Migration complete. Updated ${updatedCount} subcategories with categoryId.`);
    
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.close();
  }
}

run();
