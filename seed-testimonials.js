const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Please add your Mongo URI to .env.local");
  process.exit(1);
}

const client = new MongoClient(uri);

async function seedTestimonials() {
  try {
    await client.connect();
    const db = client.db();

    const testimonials = [
      {
        name: "Marc D.",
        role: "Gamer",
        content: "BahijaStore helped me find the perfect gaming mouse when I was completely overwhelmed by choices. Their pros and cons are brutally honest!",
        rating: 5,
        active: true,
        createdAt: new Date()
      },
      {
        name: "Sarah T.",
        role: "Tech Enthusiast",
        content: "I love the clean interface and the fact that prices are always accurate. It's my go-to site before buying any tech gadget.",
        rating: 5,
        active: true,
        createdAt: new Date()
      }
    ];

    const col = db.collection("testimonials");
    const count = await col.countDocuments();
    
    if (count === 0) {
      await col.insertMany(testimonials);
      console.log("✅ Seeded 2 testimonials!");
    } else {
      console.log("ℹ️ Testimonials already exist. Skipping seed.");
    }
  } catch (err) {
    console.error("Error seeding testimonials:", err);
  } finally {
    await client.close();
  }
}

seedTestimonials();
