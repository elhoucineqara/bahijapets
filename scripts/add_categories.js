const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

const newCatalogs = [
  { name: "For Dogs", description: "Premium products and essentials for your dog.", slug: "for-dogs", createdAt: new Date() },
  { name: "For Cats", description: "Toys, trees, and accessories for cats.", slug: "for-cats", createdAt: new Date() },
  { name: "Mice & Small Pets", description: "Products tailored for mice and other small pets.", slug: "small-pets", createdAt: new Date() },
  { name: "Others", description: "Other unique pet accessories and deals.", slug: "others", createdAt: new Date() }
];

async function run() {
  if (!uri) {
    console.error("No MONGODB_URI found.");
    return;
  }
  
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB.");
    
    // Parse the db name from the URI if possible, or fallback to the one in the connection string
    const db = client.db();
    const coll = db.collection('catalogs');
    
    for (const cat of newCatalogs) {
      const existing = await coll.findOne({ slug: cat.slug });
      if (!existing) {
        await coll.insertOne(cat);
        console.log("Inserted catalog:", cat.name);
      } else {
        console.log("Catalog already exists:", cat.name);
      }
    }
    console.log("Done.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

run();
