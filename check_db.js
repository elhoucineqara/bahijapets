const { MongoClient } = require('mongodb');

async function run() {
  const uri = "mongodb://elhoucineqara114_db_user:Z1GaFMPuC8Rbn3cl@ac-g9508ac-shard-00-00.4cqm0mp.mongodb.net:27017,ac-g9508ac-shard-00-01.4cqm0mp.mongodb.net:27017,ac-g9508ac-shard-00-02.4cqm0mp.mongodb.net:27017/bahija-store?ssl=true&replicaSet=atlas-8egktv-shard-0&authSource=admin&retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('products').updateMany(
      { seoTitle: { $exists: false } },
      { $set: { seoTitle: '', seoDescription: '', seoKeywords: '' } }
    );
    console.log('Updated ' + result.modifiedCount + ' products.');
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
