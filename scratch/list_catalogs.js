const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const catalogs = await db.collection('catalogs').find({}).toArray();
    console.log("CATALOGS:");
    catalogs.forEach(c => console.log(`${c.name} (slug: ${c.slug}, parentSlug: ${c.parentSlug || 'NULL'})`));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
