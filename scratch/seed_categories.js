const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

const catalogs = [
  // MAIN CATEGORIES
  { name: 'Dogs', slug: 'dogs', description: 'Everything your loyal friend needs, from food to fun.', parentSlug: null },
  { name: 'Cats', slug: 'cats', description: 'Premium products to keep your feline purring.', parentSlug: null },
  { name: 'Mice', slug: 'mice', description: 'Cozy homes and treats for your tiny companions.', parentSlug: null },
  
  // DOG SUBCATEGORIES
  { name: 'Dog Toys', slug: 'dog-toys', description: 'Durable and fun toys for every breed.', parentSlug: 'dogs' },
  { name: 'Dog Food & Treats', slug: 'dog-food', description: 'Nutritious meals and tasty rewards.', parentSlug: 'dogs' },
  { name: 'Beds & Comfort', slug: 'dog-beds', description: 'Orthopedic and cozy resting spots.', parentSlug: 'dogs' },
  
  // CAT SUBCATEGORIES
  { name: 'Cat Trees & Scratchers', slug: 'cat-trees', description: 'Perfect spots for climbing and scratching.', parentSlug: 'cats' },
  { name: 'Cat Toys', slug: 'cat-toys', description: 'Interactive wands, mice, and lasers.', parentSlug: 'cats' },
  { name: 'Cat Food & Treats', slug: 'cat-food', description: 'Healthy diets for happy cats.', parentSlug: 'cats' },
  
  // MICE SUBCATEGORIES
  { name: 'Mice Habitats', slug: 'mice-habitats', description: 'Spacious and secure enclosures.', parentSlug: 'mice' },
  { name: 'Mice Food', slug: 'mice-food', description: 'Specialized diets for small animals.', parentSlug: 'mice' },
  { name: 'Mice Accessories', slug: 'mice-accessories', description: 'Wheels, tubes and fun.', parentSlug: 'mice' },
];

async function run() {
  if (!uri) {
    console.error("No MONGODB_URI found.");
    return;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const coll = db.collection('catalogs');
    
    // Clear existing catalogs to ensure a clean state
    await coll.deleteMany({});
    
    // Insert new structured catalogs
    const result = await coll.insertMany(catalogs);
    console.log(`Successfully inserted ${result.insertedCount} categories and subcategories.`);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
