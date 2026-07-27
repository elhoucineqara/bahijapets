const { MongoClient } = require('mongodb');

// Replace with your MongoDB connection string
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is not set in .env.local");
  process.exit(1);
}

const client = new MongoClient(uri);

const articlesData = [
  {
    title: "The Ultimate Guide to Choosing the Best Orthopedic Bed for Your Dog",
    slug: "ultimate-guide-orthopedic-dog-beds",
    image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80",
    seoTitle: "Best Orthopedic Dog Beds Guide 2026",
    seoDescription: "Discover how to choose the perfect orthopedic bed for your dog, focusing on support, durability, and comfort for older or arthritic dogs.",
    relatedProducts: [],
    content: `
## Why Your Dog Needs an Orthopedic Bed

As dogs age, just like humans, they can develop joint issues, arthritis, and muscle stiffness. A standard dog bed often lacks the necessary support to keep your furry friend comfortable during their twilight years. Orthopedic dog beds are specifically designed to provide superior support, distribute weight evenly, and relieve pressure points.

### What Makes a Bed "Orthopedic"?

Not all beds labeled "orthopedic" are created equal. True orthopedic beds are made with high-density memory foam—the same material used in premium human mattresses. This foam conforms to your dog's body shape, supporting their spine and joints perfectly.

- **High-Density Memory Foam:** Look for beds that have at least 2-4 inches of solid memory foam, rather than shredded foam which can separate and flatten over time.
- **Waterproof Liners:** Accidents happen. A good orthopedic bed will have a waterproof inner liner to protect the expensive foam.
- **Washable Covers:** Hygiene is essential. Ensure the outer cover is easily removable and machine washable.

### Benefits of Orthopedic Beds

1. **Pain Relief:** By eliminating pressure points, these beds significantly reduce pain associated with arthritis, hip dysplasia, and joint inflammation.
2. **Improved Sleep Quality:** A comfortable dog is a well-rested dog. Better sleep translates to better overall health and mood.
3. **Temperature Regulation:** Some premium beds incorporate cooling gel into the memory foam, preventing your dog from overheating during warmer months.

### How to Choose the Right Size

Choosing the right size is crucial. Your dog should be able to stretch out fully without hanging off the edges. Measure your dog from their nose to the base of their tail while they are sleeping, and add 6-12 inches to determine the minimum length of the bed.

Investing in an orthopedic bed is investing in your dog's long-term health and happiness. Don't wait until they are visibly struggling to stand up; preventative care is always the best approach.
    `,
    views: 145,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10))
  },
  {
    title: "Understanding Your Cat's Body Language: A Comprehensive Guide",
    slug: "understanding-cat-body-language",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    seoTitle: "Cat Body Language: What is Your Cat Saying?",
    seoDescription: "Learn how to read your cat's body language, from tail flicks to ear positions, to better understand their mood and needs.",
    relatedProducts: [],
    content: `
## Decoding the Feline Mystique

Cats have a reputation for being mysterious and aloof, but in reality, they are constantly communicating with us. The key to understanding your feline companion lies in observing their body language. By paying attention to their tail, ears, eyes, and posture, you can decipher exactly what they are feeling.

### The Tale of the Tail

A cat's tail is one of their most expressive body parts. It serves as a barometer for their mood.

- **Straight Up:** A tail held high in the air, often with a slight curve at the tip, is a sign of a happy, confident, and approachable cat. This is a friendly greeting.
- **Puffed Up:** If the tail resembles a bottlebrush, your cat is terrified or feeling extremely threatened. They are trying to make themselves look larger to ward off danger.
- **Twitching or Swishing:** A slowly swishing tail usually indicates intense focus or annoyance. A rapidly flicking tail is a clear warning sign to back off.
- **Tucked Under:** A tail tucked tightly against the body indicates fear, anxiety, or submission.

### Ear Positions

Cats have highly mobile ears that convey a lot of information.

- **Forward and Alert:** The cat is interested in something and feeling relaxed.
- **Swiveled Sideways (Airplane Ears):** This usually means the cat is annoyed, anxious, or frightened. Proceed with caution.
- **Pinned Back Flat:** This is a sign of intense fear or aggression. A cat with pinned ears is ready to defend itself.

### The Eyes Have It

Your cat's eyes, specifically their pupils, can also reveal their emotional state.

- **Dilated Pupils:** While pupils dilate naturally in low light, if they are wide open in a bright room, it indicates fear, excitement, or surprise.
- **Constricted Pupils:** This can be a sign of tension or impending aggression, especially if accompanied by a fixed stare.
- **Slow Blinking:** This is the ultimate sign of feline affection and trust. It's often called a "cat kiss." Try slow blinking back at them!

By paying close attention to these subtle (and sometimes not-so-subtle) cues, you can build a deeper, more trusting relationship with your cat.
    `,
    views: 320,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 8))
  },
  {
    title: "The Ultimate Mice Care Guide for Beginners",
    slug: "ultimate-mice-care-guide",
    image: "https://images.unsplash.com/photo-1425082661705-1834bfd0999c?auto=format&fit=crop&w=800&q=80",
    seoTitle: "Pet Mice Care Guide for Beginners",
    seoDescription: "A complete guide to caring for pet mice, covering housing, diet, socialization, and health.",
    relatedProducts: [],
    content: `
## Welcome to the World of Pet Mice!

Pet mice (fancy mice) are incredibly intelligent, entertaining, and affectionate small pets. However, despite their small size, they have specific care requirements that must be met to ensure they live happy, healthy lives. This guide will walk you through the essentials of mice care.

### Housing: Creating a Mouse Mansion

The right enclosure is crucial for your mice's well-being. They need space to explore, climb, and burrow.

- **Type of Enclosure:** A glass aquarium or a wire cage with narrow spacing (no more than 1/4 inch) are the best options. Aquariums prevent drafts and keep bedding inside, while wire cages offer better ventilation and climbing opportunities.
- **Size:** Bigger is always better. A 10-gallon tank is the absolute minimum for a pair of mice, but a 20-gallon long is highly recommended.
- **Bedding:** Use safe, dust-free bedding such as aspen shavings or paper-based bedding. **Never use pine or cedar shavings**, as they contain phenols that cause severe respiratory damage in mice.
- **Accessories:** Include a solid-surface exercise wheel (at least 6-8 inches in diameter), multiple hideouts, climbing toys, and chew toys to keep their teeth filed down.

### Diet: Fueling Your Little Acrobats

A balanced diet is essential for preventing obesity and keeping your mice healthy.

- **Commercial Pellets (Lab Blocks):** This should form the foundation of their diet. Lab blocks ensure they get all the necessary nutrients in every bite, preventing them from picking out only the tasty, fatty seeds.
- **Seed Mixes:** Seed mixes can be offered as a supplement or treat, but should not be their primary food source.
- **Fresh Foods:** Offer small amounts of fresh vegetables (peas, broccoli, carrots) and fruits (apples, berries) a few times a week. Remove any uneaten fresh food promptly.
- **Water:** Fresh, clean water must be available at all times, preferably in a glass water bottle attached to the side of the enclosure.

### Social Life: Mice Are Not Solitary

Mice are highly social animals and should **never** be kept alone.

- **Females:** Female mice (does) do very well in pairs or small groups. They enjoy grooming each other and sleeping in a "mouse pile."
- **Males:** Male mice (bucks) are highly territorial and will often fight if housed together, sometimes to the death. Bucks should generally be kept alone, unless they are neutered or heavily bonded littermates (and even then, require careful monitoring).
- **Interaction:** Spend time handling and playing with your mice daily to build trust and keep them stimulated.

With the right setup and a lot of love, mice make fantastic, rewarding companions!
    `,
    views: 89,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5))
  },
  {
    title: "Top 10 Indestructible Dog Toys for Heavy Chewers",
    slug: "top-10-indestructible-dog-toys",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
    seoTitle: "Best Indestructible Dog Toys for Aggressive Chewers",
    seoDescription: "Tired of your dog destroying toys in minutes? Discover our top 10 list of truly indestructible dog toys built for aggressive chewers.",
    relatedProducts: [],
    content: `
## The Struggle of the Heavy Chewer

If you own a Pitbull, Mastiff, or just a really determined Labrador, you know the pain of bringing home a new toy only to have it shredded in less than five minutes. Not only is it a waste of money, but swallowing pieces of destroyed toys can lead to life-threatening bowel obstructions.

Finding truly "indestructible" toys is a challenge, but we've tested dozens of products to bring you the best options for aggressive chewers.

### The Criteria for Durability

When selecting a toy for a heavy chewer, look for the following materials and designs:

1. **Hard Rubber:** The gold standard for chew toys. High-quality natural rubber is durable and has enough "give" to satisfy the urge to chew without breaking teeth.
2. **Nylon:** Extremely tough, but can develop sharp edges over time. It's best used under supervision.
3. **Thick Canvas/Fire Hose Material:** Better than plush, but still vulnerable to determined incisors.
4. **No Squeakers or Stuffing:** These are the first things a heavy chewer will target and destroy.

### Our Top Recommendations

#### 1. The Classic KONG Extreme (Black)
The black KONG is made from an ultra-durable rubber formula designed specifically for power chewers. Stuff it with peanut butter and freeze it for hours of entertainment.

#### 2. GoughNuts Rubber Chew Ring
GoughNuts toys are legendary in the heavy chewer community. They feature a unique safety indicator: if your dog chews through the outer layer to expose the inner red layer, it's time to replace the toy (which the company will do for free!).

#### 3. Nylabone DuraChew Textured Ring
Made of tough nylon, this ring features ridges and nubs that help clean teeth while standing up to intense chewing sessions.

#### 4. West Paw Zogoflex Hurley Bone
This bone is surprisingly durable, floats in water, and is guaranteed tough by the manufacturer. It's also dishwasher safe!

### Safety First

Remember, **no toy is 100% indestructible**. Always supervise your dog when introducing a new toy, and regularly inspect their toys for signs of wear and tear. If pieces start breaking off, throw the toy away immediately.
    `,
    views: 450,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3))
  },
  {
    title: "How to Transition Your Cat to a Raw Food Diet",
    slug: "transitioning-cat-to-raw-food-diet",
    image: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?auto=format&fit=crop&w=800&q=80",
    seoTitle: "Raw Food Diet for Cats: A Transition Guide",
    seoDescription: "Step-by-step guide on how to safely and effectively transition your cat to a raw food diet for improved health and vitality.",
    relatedProducts: [],
    content: `
## The Benefits of a Raw Diet

More and more cat owners are turning to raw food diets (often referred to as BARF - Biologically Appropriate Raw Food) for their feline companions. Cats are obligate carnivores, meaning their bodies are designed to process raw meat, bones, and organs.

Advocates of raw feeding report numerous benefits, including:
- **Improved Digestion:** Less stool volume and odor.
- **Healthier Coat:** A shinier, softer coat with less shedding.
- **Increased Energy:** More vitality and playfulness.
- **Better Dental Health:** Chewing raw bones helps keep teeth clean.

However, transitioning a cat to a raw diet, especially an older cat used to kibble, requires patience and a systematic approach.

### Step 1: Establish Routine Feeding Times

If you free-feed your cat (leave kibble out all day), stop immediately. Transition to 2-3 specific meal times per day. A hungry cat is much more likely to try a new food than a cat who grazes all day.

### Step 2: Transition from Kibble to Wet Food

If your cat currently eats dry food, transition them to a high-quality canned wet food first. Wet food is closer in texture and moisture content to raw food. Mix a small amount of wet food into the kibble, gradually increasing the ratio of wet to dry over a period of 1-2 weeks.

### Step 3: Introduce the Raw Food

Once your cat is comfortably eating 100% wet food, you can begin introducing the raw food.

- **Start Small:** Place a pea-sized amount of raw food next to their regular wet food. Let them investigate it. Do not mix it in initially, as they might reject the whole meal.
- **Gradual Mixing:** If they eat the small amount, start mixing a tiny bit of raw food into the wet food.
- **Increase the Ratio:** Over the next 2-4 weeks, slowly increase the percentage of raw food while decreasing the wet food. Aim for a 10% increase every few days.

### Tips for Picky Eaters

Cats imprint on the texture and smell of their food when they are young, making them notoriously picky. If your cat refuses the raw food:

- **Warm it up:** Add a splash of warm water to the raw food to enhance its aroma. **Never microwave raw food containing bone**, as cooked bones splinter and are highly dangerous.
- **Add a Topper:** Sprinkle a tiny bit of nutritional yeast, crushed freeze-dried treats, or a small amount of tuna juice over the raw food to entice them.
- **Be Patient:** The transition can take anywhere from a few weeks to several months. Never starve a cat to force them to eat; cats can develop fatal hepatic lipidosis if they go without food for even a couple of days.

Always consult with a holistic veterinarian before making significant changes to your cat's diet to ensure the raw mix is nutritionally complete and balanced.
    `,
    views: 210,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2))
  },
  {
    title: "DIY Mouse Toys: Keeping Your Mice Entertained on a Budget",
    slug: "diy-mouse-toys-budget-friendly",
    image: "https://images.unsplash.com/photo-1549487771-08f5154316d2?auto=format&fit=crop&w=800&q=80",
    seoTitle: "DIY Mouse Toys: Fun and Cheap Ideas",
    seoDescription: "Learn how to make safe, engaging, and cheap DIY toys for your pet mice using everyday household items.",
    relatedProducts: [],
    content: `
## Mental Stimulation is Key

Pet mice are incredibly active and intelligent. They need a constantly changing environment to prevent boredom and stereotypical behaviors (like constant bar chewing). While pet store toys are great, the costs can add up quickly. Fortunately, you can create a wonderland for your mice using items you probably already have around the house!

### The Magic of Toilet Paper Rolls

The humble toilet paper tube is the holy grail of DIY mouse toys. It’s safe to chew, easy to find, and highly versatile.

1. **The Classic Tunnel:** Simply place the tube in the cage. Mice love running through them and hiding inside.
2. **The Foraging Roll:** Fold in one end of the tube, fill it with a mix of bedding and a few treats (like seeds or dried mealworms), and fold the other end closed. Your mice will have to chew through the cardboard to get their prize, providing excellent mental stimulation.
3. **The Cardboard Ring Toy:** Cut the tube into several 1/2-inch rings. Interlock the rings to create a small cardboard ball. You can even hide a treat inside before closing it up.

### Cardboard Boxes: Instant Castles

Never throw away a small cardboard box (like tea boxes, tissue boxes, or small shipping boxes).

- **Hideouts:** Cut a few small doors and windows into the box and place it upside down in the enclosure.
- **Multi-Level Mansions:** Stack a few small boxes on top of each other, securing them with non-toxic Elmer's school glue. Cut holes between the levels to create an intricate climbing structure. *Always ensure any tape or staples are completely removed before giving a box to your mice.*

### Popsicle Stick Creations

If you enjoy a bit of crafting, plain, uncolored wooden popsicle sticks are perfect for mice.

- **Bridges:** Lay sticks flat next to each other and glue them together using non-toxic wood glue or Elmer's glue. Once dry, this forms a sturdy bridge between platforms.
- **Climbing Ladders:** Glue sticks horizontally across two vertical sticks to create a ladder.
- **Chew Blocks:** Simply toss a few clean popsicle sticks into the cage. Mice love to gnaw on the soft wood.

### Egg Cartons

Paper egg cartons (never the styrofoam or plastic ones) make fantastic climbing structures and hideouts. Cut them in half or leave them whole. You can hide treats in the cups and close the lid, turning it into a giant foraging puzzle.

By getting creative with household items, you can provide endless entertainment for your mice without spending a dime!
    `,
    views: 134,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
  },
  {
    title: "Leash Training Your Dog: A Step-by-Step Guide",
    slug: "leash-training-your-dog-guide",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
    seoTitle: "How to Leash Train Your Dog: Step-by-Step",
    seoDescription: "Stop the pulling! Follow this comprehensive step-by-step guide to teach your dog loose-leash walking and make walks enjoyable again.",
    relatedProducts: [],
    content: `
## The Importance of Loose-Leash Walking

A walk should be an enjoyable bonding experience for both you and your dog. However, if your dog constantly pulls, lunges, or drags you down the street, walks can quickly become stressful and even dangerous. 

Leash training, specifically teaching "loose-leash walking," is a fundamental skill every dog needs. It requires patience, consistency, and a lot of high-value treats.

### Step 1: Equipment Matters

Before you begin, ensure you have the right equipment.
- **A Standard 6-Foot Leash:** Avoid retractable leashes, as they actually teach the dog that pulling extends their freedom.
- **A Proper Collar or Harness:** A front-clip harness is highly recommended for pullers, as it gently redirects their momentum back towards you when they pull.
- **High-Value Treats:** Think hot dogs, cheese, or boiled chicken cut into pea-sized pieces.

### Step 2: The "Yield to Pressure" Game (Indoors)

Start training in a low-distraction environment, like your living room. 
1. Attach the leash and let your dog wander.
2. When they hit the end of the leash and apply pressure, stop moving entirely. Plant your feet like a tree.
3. The moment your dog turns back towards you and puts slack in the leash, mark the behavior (say "Yes!" or use a clicker) and immediately reward them with a treat near your leg.
4. Repeat this until they understand that pulling stops the walk, and a loose leash brings rewards.

### Step 3: Introducing the "Heel" Position

You want your dog to understand that the best place to be is right by your side.
1. Hold a treat in the hand closest to the dog.
2. Lure them into position next to your leg.
3. Take one step forward. If they stay in position, mark and reward.
4. Gradually increase the number of steps you take before rewarding.

### Step 4: Moving Outdoors

Once your dog is walking nicely indoors, move to the backyard, then the driveway, and finally the sidewalk. The level of distraction increases with each step.

- **The Penalty for Pulling:** If your dog pulls outside, stop immediately. Do not pull back, just anchor yourself. Wait for them to step back or look at you, creating slack. Mark, reward, and resume walking.
- **The "Crazy Walk":** If they are pulling relentlessly, abruptly change direction. Turn 180 degrees and walk the other way. When they catch up to you, reward them. This teaches them to pay attention to your movements.

Consistency is key. Never let your dog get where they want to go while the leash is tight. With time and practice, you'll be enjoying peaceful, relaxed walks together.
    `,
    views: 520,
    createdAt: new Date()
  },
  {
    title: "Understanding Feline Kidney Disease: Symptoms and Management",
    slug: "feline-kidney-disease-symptoms-management",
    image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=800&q=80",
    seoTitle: "Feline Kidney Disease (CKD): Symptoms & Diet",
    seoDescription: "Learn about the early signs of chronic kidney disease in cats and how proper diet and veterinary care can manage the condition.",
    relatedProducts: [],
    content: `
## The Silent Threat

Chronic Kidney Disease (CKD) is one of the most common ailments affecting older cats. The kidneys are responsible for filtering toxins from the blood, maintaining hydration, and regulating electrolytes. When they begin to fail, the impact on a cat's overall health is significant.

The challenge with CKD is that cats are incredibly adept at hiding illness. Often, by the time clinical symptoms become obvious, a large percentage of kidney function has already been lost.

### Early Warning Signs

Early detection is critical for managing the disease and extending your cat's quality of life. Watch for these subtle signs:

- **Increased Thirst and Urination (PU/PD):** This is often the first noticeable symptom. You may find yourself filling the water bowl more often or cleaning larger clumps from the litter box.
- **Weight Loss:** Gradual, unexplained weight loss, even if their appetite seems normal.
- **Decreased Appetite:** They may become picky or eat less than usual.
- **Lethargy:** Sleeping more than usual and displaying less interest in play.
- **Vomiting:** Occasional vomiting that becomes more frequent.
- **Poor Coat Condition:** Their fur may look unkempt, dull, or spiky.

### Diagnosis

If you notice any of these signs, a veterinary visit is crucial. Diagnosis typically involves:
- **Blood Panels:** Checking BUN and Creatinine levels (waste products filtered by the kidneys).
- **SDMA Test:** A newer, more sensitive blood test that can detect kidney disease months or even years earlier than traditional tests.
- **Urinalysis:** Checking urine specific gravity (how concentrated the urine is) and looking for protein.

### Management Strategies

While there is no cure for CKD, it can often be managed successfully for years.

1. **Dietary Changes:** The cornerstone of CKD management is a prescription renal diet. These diets are restricted in phosphorus and high-quality protein to reduce the workload on the kidneys, and supplemented with omega-3 fatty acids.
2. **Hydration:** Encouraging water intake is vital. Switch to wet food exclusively, add water to their meals, and invest in multiple pet water fountains to stimulate drinking.
3. **Subcutaneous Fluids:** As the disease progresses, your vet may teach you how to administer fluids under the skin at home to keep your cat hydrated and flush out toxins.
4. **Medications:** Depending on the stage, medications may be prescribed to manage blood pressure, reduce nausea, or bind phosphorus in the gut.

Regular veterinary monitoring is essential to adjust the management plan as the disease progresses. With dedicated care, many cats with CKD live happy, comfortable lives for a long time.
    `,
    views: 310,
    createdAt: new Date()
  },
  {
    title: "Creating a Bioactive Enclosure for Your Mice",
    slug: "bioactive-enclosure-for-mice",
    image: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?auto=format&fit=crop&w=800&q=80",
    seoTitle: "Bioactive Mouse Cage Setup Guide",
    seoDescription: "Discover the benefits and steps to creating a natural, self-cleaning bioactive enclosure for your pet mice.",
    relatedProducts: [],
    content: `
## What is a Bioactive Enclosure?

A bioactive enclosure is a miniature, self-sustaining ecosystem within a terrarium. It utilizes a live substrate containing microfauna (like springtails and isopods) and live plants to break down waste, essentially creating a self-cleaning cage that closely mimics the animal's natural habitat.

While highly popular for reptiles and amphibians, bioactive setups are becoming increasingly popular for small rodents like fancy mice, offering incredible enrichment and a beautiful display.

### The Benefits of Bioactive for Mice

- **Unmatched Enrichment:** Mice love to dig and burrow. A deep, soil-based substrate allows them to construct complex tunnel systems, engaging their natural instincts.
- **Odor Control:** A healthy bioactive system breaks down ammonia and waste efficiently, resulting in a significantly less smelly cage compared to traditional bedding.
- **Aesthetic Appeal:** A well-planted bioactive tank is a beautiful piece of living art in your home.

### Step-by-Step Setup

Creating a bioactive setup requires planning and an initial investment, but the long-term payoff is huge.

#### 1. The Enclosure
You **must** use a glass aquarium or a specialized front-opening terrarium (like an Exo Terra) for bioactive. Wire cages cannot hold the necessary depth of soil. A 20-gallon long tank is the minimum recommended size.

#### 2. The Drainage Layer
Place a 1-2 inch layer of clay hydroballs (LECA) or lava rock at the bottom. This prevents the soil from becoming waterlogged. Cover this layer with a piece of fiberglass window screen to separate it from the soil.

#### 3. The Substrate (The Soil)
The substrate must hold burrows without collapsing, retain moisture, but not remain soggy. A good mix is:
- 50% Organic, fertilizer-free topsoil
- 30% Coconut coir
- 20% Play sand
Aim for a depth of at least 5-6 inches.

#### 4. The Clean-Up Crew
This is the "bio" part. Introduce springtails (tiny detritivores that eat mold and waste) and dwarf white isopods (which break down larger waste). Add leaf litter (like oak or magnolia leaves) on top of the soil to provide food and cover for the clean-up crew.

#### 5. Plants and Hardscape
- **Plants:** Use safe, non-toxic plants. Spider plants, pothos, and wheatgrass are excellent choices. Note: Mice *will* trample and eat the plants, so be prepared to replace them occasionally or use sturdy varieties.
- **Hardscape:** Add cork bark tubes, sterilized branches, and rocks to provide climbing surfaces and structure for their burrows.

### Maintenance

While self-cleaning, it's not zero-maintenance. You must spot-clean large soiled areas, wipe down the glass, and periodically mist the tank to keep the soil slightly moist (which keeps the clean-up crew alive and helps burrows hold their shape).

A bioactive setup is the ultimate luxury for pet mice, providing a slice of nature right in your living room!
    `,
    views: 180,
    createdAt: new Date()
  },
  {
    title: "10 Human Foods That Are Highly Toxic to Dogs",
    slug: "10-human-foods-toxic-to-dogs",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    seoTitle: "Toxic Foods for Dogs: What Not to Feed",
    seoDescription: "Keep your dog safe by learning which common human foods are highly toxic to dogs, including chocolate, grapes, and xylitol.",
    relatedProducts: [],
    content: `
## Kitchen Hazards for Your Canine

Those pleading puppy-dog eyes can be hard to resist when you're eating dinner, but sharing your food can sometimes be a fatal mistake. A dog's metabolism is very different from a human's, and many foods that are perfectly safe for us are highly toxic to them.

Here is a list of 10 common human foods you must keep out of reach of your dog.

### 1. Chocolate
Chocolate contains theobromine and caffeine. Dogs metabolize these substances much slower than humans. Dark chocolate and baking chocolate are the most dangerous. Ingestion can cause vomiting, diarrhea, rapid heart rate, seizures, and death.

### 2. Grapes and Raisins
Even a small amount of grapes or raisins can cause rapid and acute kidney failure in dogs. The exact toxic substance is still unknown, but the danger is very real. Keep them strictly out of reach.

### 3. Xylitol (Artificial Sweetener)
Xylitol is found in many sugar-free gums, candies, baked goods, and even some brands of peanut butter. In dogs, it causes a massive release of insulin, leading to severe hypoglycemia (low blood sugar), seizures, liver failure, and death within days. Always check the ingredient label on peanut butter!

### 4. Macadamia Nuts
These nuts contain an unknown toxin that affects a dog's nervous system. Ingestion can cause weakness, specifically in the hind legs, vomiting, tremors, and hyperthermia.

### 5. Onions, Garlic, and Chives
These vegetables (in all forms: powdered, raw, cooked, or dehydrated) contain compounds that damage a dog's red blood cells, leading to anemia. While a tiny amount might not cause immediate harm, regular consumption or a large dose can be very dangerous.

### 6. Avocado
Avocados contain a toxin called persin, which can cause vomiting and diarrhea in dogs. The pit also poses a significant choking hazard and risk of intestinal blockage.

### 7. Alcohol
Dogs are far more sensitive to alcohol than humans. Even a small amount of beer, wine, or liquor can cause vomiting, coordination problems, breathing difficulties, coma, and death.

### 8. Coffee, Tea, and Caffeine
Like chocolate, caffeine is a stimulant that dogs cannot process effectively. It can be fatal and there is no antidote. Keep coffee grounds, tea bags, and energy drinks secure.

### 9. Yeast Dough
If a dog eats raw yeast dough, it can continue to rise in their warm stomach, causing severe pain and potentially rupturing their stomach or intestines. Furthermore, as the yeast ferments the dough, it produces alcohol, leading to alcohol poisoning.

### 10. Bones (Cooked)
While raw bones are often fed safely, **cooked bones are incredibly dangerous**. The cooking process makes the bones brittle, causing them to splinter easily when chewed. These sharp splinters can puncture the digestive tract or cause severe blockages.

If you suspect your dog has eaten any of these foods, contact your veterinarian or an emergency animal poison control center immediately. Time is often critical in these situations.
    `,
    views: 650,
    createdAt: new Date()
  }
];

async function seedArticles() {
  try {
    await client.connect();
    console.log("Connected to MongoDB.");
    const db = client.db();

    console.log("Emptying articles collection...");
    await db.collection("articles").deleteMany({});

    console.log("Inserting 10 new articles...");
    const result = await db.collection("articles").insertMany(articlesData);

    console.log("Successfully inserted " + result.insertedCount + " articles.");
  } catch (error) {
    console.error("Error seeding articles:", error);
  } finally {
    await client.close();
  }
}

seedArticles();
