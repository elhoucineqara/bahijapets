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
    
    console.log("Fetching subcategories from categories collection...");
    const subcats = await db.collection('categories').find({ parentSlug: { $ne: null } }).toArray();
    
    if (subcats.length > 0) {
      console.log(`Inserting ${subcats.length} subcategories into new collection...`);
      // Ensure we insert them cleanly (remove the old _id so Mongo generates a new one, or keep it, doesn't matter much)
      const toInsert = subcats.map(s => {
        const { _id, ...rest } = s;
        return rest;
      });
      await db.collection('subcategories').insertMany(toInsert);
      
      console.log("Removing subcategories from categories collection...");
      await db.collection('categories').deleteMany({ parentSlug: { $ne: null } });
      
      // Update products that use these subcategories.
      // Currently a product might have categorySlug = 'dog-toys' which is actually a subcategory!
      // If a product has categorySlug = 'dog-toys', it should now have:
      // categorySlug = 'dogs' (the parent of dog-toys)
      // subcategorySlug = 'dog-toys'
      console.log("Updating products category and subcategory links...");
      for (const sub of subcats) {
        await db.collection('products').updateMany(
          { categorySlug: sub.slug },
          { $set: { categorySlug: sub.parentSlug, subcategorySlug: sub.slug } }
        );
      }
      
      console.log("Removing parentSlug from main categories...");
      await db.collection('categories').updateMany({}, { $unset: { parentSlug: "" } });
      
    } else {
      console.log("No subcategories found in categories collection (maybe already split?).");
    }

    console.log("Migration complete.");
    
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.close();
  }
}

run();
