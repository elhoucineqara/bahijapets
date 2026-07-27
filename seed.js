const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Please add your Mongo URI to .env.local");
  process.exit(1);
}

const client = new MongoClient(uri);

async function seedData() {
  try {
    await client.connect();
    const db = client.db();

    console.log("Connected to MongoDB");

    // Seed Subscribers
    const subscribers = [
      { email: "tech.enthusiast99@example.com", createdAt: new Date(Date.now() - 86400000 * 2), status: "active" },
      { email: "gadget.lover@example.net", createdAt: new Date(Date.now() - 86400000 * 5), status: "active" },
      { email: "pro.gamer.z@example.org", createdAt: new Date(Date.now() - 86400000 * 10), status: "active" },
      { email: "smart.home.fan@example.com", createdAt: new Date(), status: "active" }
    ];

    const subsCol = db.collection("subscribers");
    const existingSubsCount = await subsCol.countDocuments();
    if (existingSubsCount === 0) {
      await subsCol.insertMany(subscribers);
      console.log("✅ Seeded 4 subscribers!");
    } else {
      console.log("ℹ️ Subscribers already exist. Skipping seed.");
    }

    // Seed Articles
    const articles = [
      {
        title: "Top 5 Interactive Toys for Indoor Cats",
        slug: "top-5-interactive-toys-indoor-cats",
        content: `Keeping your indoor cat entertained is crucial for their physical and mental health. Without stimulation, cats can become bored and destructive.

### 1. The Automatic Laser Pointer
A classic favorite! Modern laser pointers can rotate automatically and create unpredictable patterns that keep your cat guessing.

### 2. Treat-Dispensing Puzzles
These toys engage your cat's natural hunting instincts by making them work for their food. It slows down their eating and stimulates their brain.

**Things to consider:**
* Durability of the toy
* Safety (no small ingestible parts)
* Ease of cleaning

Make sure to check our recommended picks in our product catalog!`,
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
        seoTitle: "Best Interactive Toys for Indoor Cats in 2026",
        seoDescription: "Discover the top 5 interactive toys to keep your indoor cat entertained and healthy. Compare lasers, puzzles, and more.",
        relatedProducts: [],
        views: 142,
        createdAt: new Date(Date.now() - 86400000 * 3)
      },
      {
        title: "Ultimate Guide to Dog Nutrition",
        slug: "ultimate-guide-dog-nutrition",
        content: `Choosing the right food for your dog can completely change their energy levels, coat health, and overall well-being. But with so many options, where do you start?

### Where to start?
The best starting point is to consult your veterinarian to understand your dog's specific needs based on their breed, age, and activity level.

### Dry vs. Wet Food
Dry kibble is great for dental health and convenience, while wet food provides extra hydration and is often more palatable for picky eaters.

### Ingredients to Look For
Always look for named meat sources as the first ingredient and avoid artificial colors and preservatives.

*Stay tuned for more pet care guides!*`,
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80",
        seoTitle: "Dog Nutrition Guide: How to Feed Your Dog Right",
        seoDescription: "Learn the basics of dog nutrition. We cover wet vs dry food, essential ingredients, and how to choose the best diet.",
        relatedProducts: [],
        views: 356,
        createdAt: new Date(Date.now() - 86400000 * 7)
      }
    ];

    const articlesCol = db.collection("articles");
    const existingArticlesCount = await articlesCol.countDocuments();
    if (existingArticlesCount === 0) {
      await articlesCol.insertMany(articles);
      console.log("✅ Seeded 2 blog articles!");
    } else {
      console.log("ℹ️ Articles already exist. Skipping seed.");
    }

    // Seed Catalogs (Categories)
    const seedCatalogs = [
      { name: "Dog Essentials", description: "Premium food, toys, beds, and accessories for dogs.", slug: "dog-essentials", createdAt: new Date() },
      { name: "Cat Trees & Toys", description: "Everything your cat needs to play and scratch.", slug: "cat-trees", createdAt: new Date() },
      { name: "Pet Tech", description: "Smart feeders, cameras, and automated care.", slug: "pet-tech", createdAt: new Date() }
    ];

    const catalogsCol = db.collection("catalogs");
    const existingCatalogsCount = await catalogsCol.countDocuments();
    if (existingCatalogsCount === 0) {
      await catalogsCol.insertMany(seedCatalogs);
      console.log("✅ Seeded 3 catalogs (categories)!");
    } else {
      console.log("ℹ️ Catalogs already exist. Skipping seed.");
    }

  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

seedData();
