import { Product } from "@/components/product/ProductCard";

/**
 * Demo Product Data for Ayurvedic Store
 * Replace with actual database/API data in production
 */

export const featuredProducts: Product[] = [
  // HERO PRODUCT - Hair Oil
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Ayurvedic Hair Oil",
    slug: "ayurvedic-hair-oil",
    description: "Premium Ayurvedic hair oil with bhringraj, amla, and hibiscus for thick, lustrous hair growth. Traditional formula for healthy scalp and strong roots.",
    shortDescription: "Ancient Ayurvedic formula for stronger, thicker hair with natural herbs.",
    longDescription: `Experience the transformative power of traditional Ayurvedic hair care with our premium Ayurvedic Hair Oil. This carefully crafted blend combines the wisdom of 5,000-year-old Ayurvedic traditions with modern quality standards to deliver exceptional results for all hair types.

Our signature formula features Bhringraj (Eclipta Alba), known as the "King of Herbs" for hair, which has been used for centuries in India to promote hair growth and prevent premature graying. Combined with nutrient-rich Amla (Indian Gooseberry), one of the highest natural sources of Vitamin C, this oil strengthens hair follicles from root to tip.

The addition of Hibiscus flowers provides natural conditioning properties that add shine and softness, while Brahmi nourishes the scalp and reduces stress-related hair fall. Coconut oil serves as the perfect carrier, ensuring deep penetration and long-lasting moisture.

Regular use of this Ayurvedic hair oil helps reduce hair fall by up to 50%, promotes new hair growth, prevents dandruff and scalp infections, adds natural shine and bounce, and strengthens hair from roots to tips. The lightweight, non-greasy formula absorbs quickly without leaving residue.

Ideal for those experiencing hair thinning, premature graying, dry scalp, or simply anyone seeking healthier, more vibrant hair. This oil is suitable for all hair types including color-treated hair. Made in India with 100% natural ingredients, no parabens, sulfates, or artificial fragrances.`,
    price: 649,
    originalPrice: 799,
    image: "/images/hair oil.png",
    category: "Hair Care",
    inStock: true,
    isBestseller: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 345,
    doshaType: "all",
    benefits: [
      "Reduces hair fall by up to 50%",
      "Promotes new hair growth",
      "Prevents premature graying",
      "Nourishes dry scalp",
      "Adds natural shine and bounce",
      "Strengthens hair from roots to tips",
    ],
    metaTitle: "Ayurvedic Hair Oil | Natural Bhringraj & Amla Hair Growth Oil",
    metaDescription: "Buy premium Ayurvedic hair oil with Bhringraj, Amla & Hibiscus. Reduces hair fall, promotes growth & adds shine. 100% natural, paraben-free. Free shipping!",
    keywords: [
      "ayurvedic hair oil",
      "bhringraj oil",
      "amla hair oil",
      "natural hair growth oil",
      "herbal hair oil",
      "hair fall control",
      "Indian hair oil",
      "organic hair oil",
      "hibiscus hair oil",
      "scalp nourishment",
    ],
    ingredients: [
      "Bhringraj (Eclipta Alba) Extract",
      "Amla (Indian Gooseberry) Extract",
      "Hibiscus Flower Extract",
      "Brahmi (Bacopa Monnieri) Extract",
      "Virgin Coconut Oil",
      "Sesame Oil",
      "Neem Oil",
      "Fenugreek Seed Extract",
      "Curry Leaf Extract",
      "Vitamin E",
    ],
    howToUse: "Warm a small amount of oil and massage gently into scalp using circular motions. Leave for at least 30 minutes or overnight for best results. Wash with a mild shampoo. Use 2-3 times per week for optimal results. Can also be used as a pre-shampoo treatment or leave-in conditioner for dry ends.",
    warnings: "For external use only. Avoid contact with eyes. If irritation occurs, discontinue use. Perform a patch test before first use. Keep away from children. Store in a cool, dry place away from direct sunlight.",
    shelfLife: "24 months from date of manufacture",
    madeIn: "India",
    certifications: [
      "GMP Certified",
      "ISO 9001:2015",
      "AYUSH Approved",
      "Cruelty-Free",
      "100% Vegan",
    ],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Active Protein Powder",
    slug: "active-protein-powder",
    description: "Herbal protein blend with ashwagandha, shatavari, and moringa for muscle strength and vitality.",
    shortDescription: "Plant-based Ayurvedic protein for muscle strength and natural energy.",
    longDescription: `Unlock your full potential with our Active Protein Powder - a revolutionary plant-based protein supplement that combines ancient Ayurvedic wisdom with modern nutritional science. Unlike conventional protein powders loaded with artificial ingredients, our formula harnesses the power of time-tested herbs to support muscle growth, enhance stamina, and promote overall vitality.

At the heart of this formula is Ashwagandha (Withania Somnifera), the legendary adaptogenic herb known for centuries in Ayurveda as a natural strength enhancer. Clinical studies show Ashwagandha can increase muscle mass, reduce body fat, and improve exercise performance by up to 15%. Combined with Shatavari, which supports hormonal balance and tissue regeneration, this creates a powerful foundation for physical development.

Moringa, often called the "Miracle Tree," provides a complete amino acid profile along with iron, calcium, and antioxidants. We've added organic pea protein and brown rice protein for a complete, easily digestible protein source that delivers 25g of protein per serving without bloating or digestive discomfort.

This Ayurvedic protein powder is perfect for fitness enthusiasts, athletes, busy professionals, or anyone looking to increase their daily protein intake naturally. The adaptogenic herbs help reduce exercise-induced stress, improve recovery time, and support sustained energy throughout the day.

Free from whey, soy, gluten, and artificial sweeteners. Naturally flavored with vanilla and cardamom for a delicious taste that blends smoothly with water, milk, or your favorite smoothie.`,
    price: 899,
    originalPrice: 1099,
    image: "/images/active protein.jpeg",
    category: "Supplements",
    inStock: true,
    isNew: true,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 312,
    doshaType: "all",
    benefits: [
      "25g plant-based protein per serving",
      "Supports muscle growth and recovery",
      "Enhances stamina and endurance",
      "Reduces exercise-induced stress",
      "Promotes natural energy without crash",
      "Easy to digest, no bloating",
    ],
    metaTitle: "Ayurvedic Protein Powder | Plant-Based with Ashwagandha & Moringa",
    metaDescription: "Premium Ayurvedic protein powder with Ashwagandha, Shatavari & Moringa. 25g plant protein, builds muscle naturally. Vegan, gluten-free. Shop now!",
    keywords: [
      "ayurvedic protein powder",
      "plant-based protein",
      "ashwagandha protein",
      "herbal protein supplement",
      "vegan protein India",
      "moringa protein",
      "natural muscle builder",
      "organic protein powder",
      "adaptogenic protein",
      "shatavari supplement",
    ],
    ingredients: [
      "Organic Pea Protein Isolate",
      "Brown Rice Protein",
      "Ashwagandha Root Extract (KSM-66)",
      "Shatavari Root Extract",
      "Moringa Leaf Powder",
      "Spirulina",
      "Natural Vanilla Flavor",
      "Cardamom Extract",
      "Digestive Enzyme Blend",
      "Stevia Leaf Extract",
    ],
    howToUse: "Mix 1 scoop (30g) with 250ml water, milk, or plant-based milk. Shake or blend until smooth. Consume within 30 minutes post-workout for best results, or use as a meal replacement. Can be added to smoothies, oatmeal, or baked goods. Do not exceed 2 servings per day.",
    warnings: "Consult a healthcare professional before use if pregnant, nursing, or taking medications. Not intended for children under 18. May contain traces of nuts. Do not use as a sole source of nutrition. Keep out of reach of children.",
    shelfLife: "18 months from date of manufacture",
    madeIn: "India",
    certifications: [
      "FSSAI Approved",
      "GMP Certified",
      "100% Vegan",
      "Gluten-Free Certified",
      "Non-GMO Project Verified",
    ],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Diabetes Care Supplement",
    slug: "diabetes-care-supplement",
    description: "Ayurvedic herbal formula with karela, jamun, and gudmar to support healthy blood sugar levels naturally.",
    shortDescription: "Natural blood sugar support with traditional Ayurvedic herbs.",
    longDescription: `Take control of your metabolic health naturally with our Diabetes Care Supplement, a comprehensive Ayurvedic formula designed to support healthy blood sugar levels and improve overall metabolic function. This potent blend combines the most effective blood sugar-regulating herbs from traditional Indian medicine, backed by modern scientific research.

Karela (Bitter Melon) is the star ingredient, containing plant insulin (polypeptide-p) that works similarly to human insulin. Studies show Karela can reduce fasting blood glucose levels by up to 25%. Jamun (Indian Blackberry) seeds contain jamboline, which helps control the conversion of starch into sugar, making it invaluable for glycemic control.

Gudmar (Gymnema Sylvestre), whose Sanskrit name means "sugar destroyer," has been used for over 2,000 years in Ayurveda. This remarkable herb temporarily blocks sugar receptors on taste buds and in the intestines, reducing sugar cravings and glucose absorption. Combined with Vijaysar (Indian Kino), which releases pterostilbene to help manage blood sugar, this formula provides comprehensive support.

Our supplement also includes Methi (Fenugreek) seeds rich in soluble fiber that slows carbohydrate digestion and sugar absorption, plus antioxidant-rich Amla to protect against diabetic complications. Neem and Turmeric provide anti-inflammatory benefits that support pancreatic health.

This natural approach to blood sugar management works best when combined with a balanced diet, regular exercise, and proper medical care. Our supplement is designed to complement, not replace, prescribed medications.`,
    price: 599,
    originalPrice: 749,
    image: "/images/diabetes care.jpeg",
    category: "Supplements",
    inStock: true,
    rating: 4.7,
    reviewCount: 198,
    doshaType: "kapha",
    benefits: [
      "Supports healthy blood sugar levels",
      "Reduces sugar cravings naturally",
      "Improves insulin sensitivity",
      "Supports pancreatic health",
      "Provides antioxidant protection",
      "Aids healthy metabolism",
    ],
    metaTitle: "Diabetes Care Supplement | Ayurvedic Blood Sugar Support Formula",
    metaDescription: "Natural Ayurvedic diabetes care supplement with Karela, Jamun & Gudmar. Supports healthy blood sugar levels. Clinically studied herbs. Order now!",
    keywords: [
      "diabetes care supplement",
      "blood sugar control",
      "karela capsules",
      "jamun supplement",
      "gudmar extract",
      "ayurvedic diabetes medicine",
      "natural blood sugar support",
      "herbal diabetes remedy",
      "sugar control supplement",
      "glycemic support",
    ],
    ingredients: [
      "Karela (Bitter Melon) Extract",
      "Jamun (Indian Blackberry) Seed Extract",
      "Gudmar (Gymnema Sylvestre) Leaf Extract",
      "Vijaysar (Indian Kino) Bark Extract",
      "Methi (Fenugreek) Seed Extract",
      "Amla (Indian Gooseberry) Extract",
      "Neem Leaf Extract",
      "Turmeric Root Extract (95% Curcuminoids)",
      "Dalchini (Cinnamon) Bark Extract",
      "Giloy (Tinospora Cordifolia) Extract",
    ],
    howToUse: "Take 2 capsules twice daily, 30 minutes before meals with warm water. For best results, maintain a balanced diet low in refined sugars and exercise regularly. Continue for at least 3 months for optimal benefits. Monitor blood sugar levels regularly.",
    warnings: "Not a substitute for prescribed diabetes medication. Consult your doctor before use, especially if on diabetes medication, as dosage adjustment may be needed. Monitor blood sugar regularly. Not recommended during pregnancy or breastfeeding. May cause hypoglycemia if combined with diabetes drugs.",
    shelfLife: "24 months from date of manufacture",
    madeIn: "India",
    certifications: [
      "FSSAI Approved",
      "AYUSH Certified",
      "GMP Certified",
      "ISO 22000:2018",
      "Clinically Studied Ingredients",
    ],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Ayurvedic Cough Syrup",
    slug: "ayurvedic-cough-syrup",
    description: "Natural herbal cough syrup with tulsi, ginger, and honey for respiratory relief and throat soothing.",
    shortDescription: "Gentle, effective relief for cough and cold with pure Ayurvedic herbs.",
    longDescription: `Breathe easier and soothe your throat naturally with our Ayurvedic Cough Syrup, a time-tested herbal remedy that provides fast, effective relief from cough, cold, and respiratory discomfort. This gentle yet powerful formula is crafted using traditional Ayurvedic principles and the finest natural ingredients, making it suitable for the whole family.

Tulsi (Holy Basil), revered as the "Queen of Herbs" in Ayurveda, forms the foundation of this syrup. Rich in eugenol, camphene, and cineole, Tulsi has powerful antibacterial, antiviral, and anti-inflammatory properties that help fight respiratory infections at their source. Combined with Adulsa (Malabar Nut), a renowned expectorant that has been used for centuries to relieve bronchial congestion, this formula effectively loosens and expels mucus.

Fresh ginger extract provides warming relief that soothes irritated throats and reduces inflammation, while pure wild honey coats the throat, suppresses cough reflexes, and offers natural antimicrobial benefits. Mulethi (Licorice) root adds demulcent properties that protect and heal the respiratory tract lining.

Unlike conventional cough syrups that merely suppress symptoms, our Ayurvedic formula addresses the root cause of respiratory issues while supporting your body's natural healing processes. The addition of Pippali (Long Pepper) enhances bioavailability of all ingredients and provides gentle warming action to clear congestion.

This non-drowsy formula contains no artificial colors, flavors, or alcohol, making it safe for children over 3 years and adults alike. The natural honey base provides a pleasant taste that even children will accept.`,
    price: 299,
    originalPrice: 399,
    image: "/images/coughsyrup.jpeg",
    category: "Supplements",
    inStock: true,
    isBestseller: true,
    rating: 4.8,
    reviewCount: 234,
    doshaType: "kapha",
    benefits: [
      "Provides fast relief from cough",
      "Soothes sore and irritated throat",
      "Loosens and expels mucus",
      "Supports respiratory health",
      "Boosts natural immunity",
      "Non-drowsy formula",
    ],
    metaTitle: "Ayurvedic Cough Syrup | Natural Herbal Relief with Tulsi & Honey",
    metaDescription: "Buy Ayurvedic cough syrup with Tulsi, Ginger & Honey. Fast relief from cough, cold & sore throat. Safe for family. No drowsiness. Order online!",
    keywords: [
      "ayurvedic cough syrup",
      "herbal cough medicine",
      "tulsi cough syrup",
      "natural cough remedy",
      "honey ginger cough syrup",
      "throat soothing syrup",
      "organic cough medicine",
      "kids cough syrup natural",
      "bronchial congestion relief",
      "respiratory health supplement",
    ],
    ingredients: [
      "Tulsi (Holy Basil) Extract",
      "Adulsa (Malabar Nut) Extract",
      "Fresh Ginger Extract",
      "Pure Wild Honey",
      "Mulethi (Licorice) Root Extract",
      "Pippali (Long Pepper) Extract",
      "Kantakari (Yellow Berried Nightshade)",
      "Banafsha (Viola Odorata) Extract",
      "Somlata Extract",
      "Pudina (Mint) Extract",
    ],
    howToUse: "Adults: Take 2 teaspoons (10ml) three times daily after meals. Children (3-12 years): Take 1 teaspoon (5ml) three times daily after meals. For acute symptoms, can be taken every 4 hours. Shake well before use. Can be taken directly or mixed with warm water.",
    warnings: "Not recommended for children under 3 years. Diabetics should consult a doctor due to honey content. If symptoms persist for more than 7 days, consult a healthcare professional. Not recommended during pregnancy without medical advice. Keep refrigerated after opening.",
    shelfLife: "24 months from date of manufacture (use within 3 months after opening)",
    madeIn: "India",
    certifications: [
      "FSSAI Approved",
      "AYUSH Certified",
      "GMP Certified",
      "Alcohol-Free",
      "No Artificial Colors",
    ],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Liver Care Capsules",
    slug: "liver-care-capsules",
    description: "Protective liver support with kutki, punarnava, and bhumi amla for detoxification and liver health.",
    shortDescription: "Complete liver protection and detoxification with powerful Ayurvedic herbs.",
    longDescription: `Give your liver the care it deserves with our Liver Care Capsules, a comprehensive Ayurvedic formula designed to protect, cleanse, and rejuvenate your liver naturally. In today's world of processed foods, environmental toxins, and stressful lifestyles, liver health has never been more important. This potent herbal blend supports your body's primary detoxification organ using time-tested Ayurvedic ingredients.

Kutki (Picrorhiza Kurroa) is the cornerstone of this formulation, recognized in Ayurveda as the most powerful liver-protective herb. Modern research confirms its hepatoprotective properties, showing it can help regenerate liver cells and protect against damage from toxins, alcohol, and medications. Our formula uses standardized extract with 4% kutkoside for consistent potency.

Bhumi Amla (Phyllanthus Niruri), also known as "Stone Breaker," has been used traditionally for liver and gallbladder support. It helps optimize bile production and flow while providing powerful antioxidant protection. Punarnava (Boerhavia Diffusa), meaning "one that renews," supports the liver's natural regeneration processes and helps reduce fluid retention.

We've enhanced this formula with Kalmegh (Andrographis Paniculata), often called "King of Bitters," which supports immune function and protects liver cells from oxidative stress. Bhuiamla and Giloy round out the blend, providing comprehensive support for liver enzyme levels and overall hepatic function.

This supplement is ideal for those looking to support liver health after illness, those who consume alcohol occasionally, individuals taking long-term medications, or anyone seeking a natural liver detox. The gentle yet effective formula is suitable for daily use as part of a healthy lifestyle.`,
    price: 549,
    originalPrice: 699,
    image: "/images/live care.jpeg",
    category: "Supplements",
    inStock: true,
    rating: 4.6,
    reviewCount: 78,
    doshaType: "pitta",
    benefits: [
      "Protects liver cells from damage",
      "Supports natural detoxification",
      "Promotes liver cell regeneration",
      "Maintains healthy liver enzyme levels",
      "Optimizes bile production",
      "Provides antioxidant protection",
    ],
    metaTitle: "Liver Care Capsules | Ayurvedic Liver Detox with Kutki & Bhumi Amla",
    metaDescription: "Natural Ayurvedic liver care capsules with Kutki, Punarnava & Bhumi Amla. Protects, detoxifies & rejuvenates liver. GMP certified. Buy online!",
    keywords: [
      "liver care capsules",
      "ayurvedic liver support",
      "kutki supplement",
      "liver detox capsules",
      "bhumi amla tablets",
      "natural liver cleanse",
      "hepatoprotective herbs",
      "liver health supplement",
      "punarnava capsules",
      "fatty liver ayurvedic medicine",
    ],
    ingredients: [
      "Kutki (Picrorhiza Kurroa) Root Extract (4% Kutkoside)",
      "Bhumi Amla (Phyllanthus Niruri) Extract",
      "Punarnava (Boerhavia Diffusa) Root Extract",
      "Kalmegh (Andrographis Paniculata) Extract",
      "Kasni (Chicory) Seed Extract",
      "Makoy (Solanum Nigrum) Extract",
      "Giloy (Tinospora Cordifolia) Extract",
      "Haritaki (Terminalia Chebula) Extract",
      "Triphala Extract",
      "Black Pepper Extract (for bioavailability)",
    ],
    howToUse: "Take 1-2 capsules twice daily with warm water after meals. For intensive liver support, take 2 capsules twice daily. Continue for at least 2-3 months for optimal results. Best results when combined with a balanced diet, adequate hydration, and limited alcohol consumption.",
    warnings: "Consult a healthcare professional before use if you have existing liver conditions, are pregnant or nursing, or taking prescription medications. Not intended for children. May interact with certain medications. Discontinue use if any adverse reactions occur.",
    shelfLife: "36 months from date of manufacture",
    madeIn: "India",
    certifications: [
      "FSSAI Approved",
      "GMP Certified",
      "ISO 9001:2015",
      "AYUSH Approved",
      "Heavy Metal Tested",
    ],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "Liver Oil Extract",
    slug: "liver-oil-extract",
    description: "Concentrated liver oil with omega fatty acids and Ayurvedic herbs for liver regeneration.",
    shortDescription: "Premium liver-supporting oil with essential fatty acids and healing herbs.",
    longDescription: `Discover the healing power of our Liver Oil Extract, a unique Ayurvedic formulation that combines the benefits of essential fatty acids with potent liver-supporting herbs. This innovative supplement bridges traditional Ayurvedic wisdom with modern nutritional science to provide comprehensive liver support in an easily absorbable liquid form.

Unlike capsules that may take time to break down, our liquid extract ensures rapid absorption and bioavailability. The oil base consists of cold-pressed organic sesame oil, traditionally used in Ayurveda for its ability to penetrate deep into tissues and carry medicinal compounds to where they're needed most.

This formula features a specialized blend of omega-3 and omega-6 fatty acids from flaxseed oil, which research shows can help reduce liver inflammation and support healthy liver fat metabolism. The addition of milk thistle oil, standardized to 80% silymarin, provides powerful antioxidant protection and supports liver cell membrane integrity.

Infused with Bhringraj, known in Ayurveda as a liver rejuvenator, and Kalmegh for its bitter principles that stimulate liver function, this oil provides comprehensive hepatoprotective support. Turmeric CO2 extract adds anti-inflammatory benefits while black pepper extract ensures maximum absorption of all active compounds.

The unique sublingual delivery option allows for faster absorption by bypassing the digestive system, making this ideal for those with compromised digestion or those seeking quick results. Can also be added to food or taken straight.

Perfect for those seeking a convenient, effective way to support liver health as part of their daily wellness routine.`,
    price: 749,
    originalPrice: 899,
    image: "/images/liver oil.jpeg",
    category: "Essential Oils",
    inStock: true,
    rating: 4.5,
    reviewCount: 89,
    doshaType: "pitta",
    benefits: [
      "Rapid absorption liquid formula",
      "Supports healthy liver function",
      "Provides essential fatty acids",
      "Anti-inflammatory properties",
      "Promotes liver cell regeneration",
      "Convenient sublingual option",
    ],
    metaTitle: "Liver Oil Extract | Ayurvedic Omega-Rich Liver Support Supplement",
    metaDescription: "Premium liver oil extract with Omega fatty acids, Milk Thistle & Ayurvedic herbs. Fast-absorbing liquid for liver regeneration. Shop now!",
    keywords: [
      "liver oil extract",
      "ayurvedic liver oil",
      "omega liver support",
      "milk thistle oil",
      "liquid liver supplement",
      "hepatic oil supplement",
      "natural liver regeneration",
      "fatty acid liver health",
      "bhringraj oil supplement",
      "liver detox oil",
    ],
    ingredients: [
      "Cold-Pressed Organic Sesame Oil",
      "Flaxseed Oil (Omega-3 & Omega-6)",
      "Milk Thistle Seed Oil (80% Silymarin)",
      "Bhringraj (Eclipta Alba) Oil Infusion",
      "Kalmegh (Andrographis) CO2 Extract",
      "Turmeric CO2 Extract (95% Curcuminoids)",
      "Black Cumin Seed Oil",
      "Vitamin E (Mixed Tocopherols)",
      "Black Pepper Extract (Piperine)",
      "Rosemary Antioxidant",
    ],
    howToUse: "Take 1 teaspoon (5ml) daily. Can be taken directly, held under tongue for 30 seconds for sublingual absorption, or mixed into food/smoothies. Best taken with a meal containing healthy fats for optimal absorption. Do not heat or cook with this oil. Can be increased to 2 teaspoons daily for intensive support.",
    warnings: "For oral use only. Consult a healthcare provider before use if pregnant, nursing, or taking blood-thinning medications. Store in refrigerator after opening and use within 60 days. Do not use if seal is broken. May cause mild digestive upset initially; reduce dose if this occurs.",
    shelfLife: "18 months from date of manufacture (60 days after opening)",
    madeIn: "India",
    certifications: [
      "FSSAI Approved",
      "Organic Certified",
      "Cold-Pressed",
      "GMP Certified",
      "Third-Party Tested",
    ],
  },
];

export const categories = [
  "All Products",
  "Supplements",
  "Herbal Teas",
  "Skincare",
  "Essential Oils",
  "Hair Care",
];

export const testimonials = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "Yoga Instructor",
    image: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    text: "The Ashwagandha powder has been a game-changer for my stress levels. I feel more balanced and energized throughout the day. Highly recommend!",
  },
  {
    id: "2",
    name: "Rahul Verma",
    role: "Software Engineer",
    image: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    text: "As someone who sits at a desk all day, the Triphala capsules have improved my digestion significantly. Great quality products!",
  },
  {
    id: "3",
    name: "Anjali Patel",
    role: "Nutritionist",
    image: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    text: "I've tried many Ayurvedic brands, but Ayurveda Haven stands out for their purity and authenticity. The face cream is absolutely divine!",
  },
  {
    id: "4",
    name: "Vikram Singh",
    role: "Fitness Coach",
    image: "https://i.pravatar.cc/150?img=13",
    rating: 4,
    text: "The Chyawanprash has boosted my immunity noticeably. I haven't caught a cold in months. The taste is also quite pleasant!",
  },
];

export const wisdomPosts = [
  {
    id: "1",
    title: "Understanding Your Dosha: A Beginner's Guide",
    excerpt: "Discover the three Ayurvedic body types (Vata, Pitta, Kapha) and learn how to identify your unique constitution for optimal health.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
    category: "Ayurvedic Basics",
    readTime: "8 min read",
    slug: "understanding-your-dosha",
  },
  {
    id: "2",
    title: "5 Morning Rituals from Ancient Ayurveda",
    excerpt: "Start your day the Ayurvedic way with these time-tested practices for energy, clarity, and wellness.",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&q=80",
    category: "Lifestyle",
    readTime: "6 min read",
    slug: "ayurvedic-morning-rituals",
  },
  {
    id: "3",
    title: "The Power of Turmeric: Golden Spice Healing",
    excerpt: "Explore the incredible anti-inflammatory and antioxidant properties of turmeric and how to incorporate it into your diet.",
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&q=80",
    category: "Herbs & Spices",
    readTime: "7 min read",
    slug: "power-of-turmeric",
  },
];

// Extended wisdom posts for the blog page
export const extendedWisdomPosts = [
  ...wisdomPosts,
  {
    id: "4",
    title: "Ashwagandha: The Ancient Stress Reliever",
    excerpt: "Learn about the powerful adaptogenic properties of Ashwagandha and how it can help manage modern stress and anxiety.",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80",
    category: "Herbs & Spices",
    readTime: "9 min read",
    slug: "ashwagandha-stress-reliever",
  },
  {
    id: "5",
    title: "Eating According to Your Dosha Type",
    excerpt: "Discover personalized nutrition guidelines based on your Ayurvedic constitution for better digestion and overall health.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    category: "Nutrition",
    readTime: "10 min read",
    slug: "eating-by-dosha-type",
  },
  {
    id: "6",
    title: "The Art of Abhyanga: Self-Oil Massage",
    excerpt: "Master the traditional Ayurvedic practice of self-massage with warm oils for relaxation, detoxification, and skin nourishment.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
    category: "Wellness",
    readTime: "7 min read",
    slug: "abhyanga-self-massage",
  },
  {
    id: "7",
    title: "Seasonal Eating: The Ayurvedic Way",
    excerpt: "Align your diet with the seasons to maintain balance and prevent disease according to Ayurvedic principles.",
    image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&q=80",
    category: "Nutrition",
    readTime: "8 min read",
    slug: "seasonal-eating-ayurveda",
  },
  {
    id: "8",
    title: "Triphala: The Three-Fruit Wonder",
    excerpt: "Unlock the digestive and detoxifying benefits of this powerful Ayurvedic formula made from three sacred fruits.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80",
    category: "Herbs & Spices",
    readTime: "6 min read",
    slug: "triphala-three-fruit-wonder",
  },
  {
    id: "9",
    title: "Yoga and Ayurveda: Perfect Partners",
    excerpt: "Explore how yoga practices complement Ayurvedic principles for holistic mind-body wellness.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
    category: "Lifestyle",
    readTime: "9 min read",
    slug: "yoga-ayurveda-partners",
  },
  {
    id: "10",
    title: "Ayurvedic Skincare Rituals for Glowing Skin",
    excerpt: "Natural beauty secrets from ancient Ayurveda to achieve radiant, healthy skin without harsh chemicals.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
    category: "Wellness",
    readTime: "8 min read",
    slug: "ayurvedic-skincare-rituals",
  },
  {
    id: "11",
    title: "Balancing Vata: Tips for the Air Element",
    excerpt: "Practical advice for calming Vata dosha imbalances including anxiety, dry skin, and irregular digestion.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80",
    category: "Dosha Guide",
    readTime: "7 min read",
    slug: "balancing-vata-dosha",
  },
  {
    id: "12",
    title: "Cooling Pitta: Managing the Fire Within",
    excerpt: "Learn how to balance excess Pitta with cooling foods, herbs, and lifestyle practices for better emotional and physical health.",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&q=80",
    category: "Dosha Guide",
    readTime: "8 min read",
    slug: "cooling-pitta-dosha",
  },
  {
    id: "13",
    title: "Energizing Kapha: Overcoming Sluggishness",
    excerpt: "Strategies to stimulate and balance Kapha dosha when feeling heavy, lethargic, or congested.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
    category: "Dosha Guide",
    readTime: "7 min read",
    slug: "energizing-kapha-dosha",
  },
  {
    id: "14",
    title: "Holy Basil (Tulsi): The Queen of Herbs",
    excerpt: "Discover why Tulsi is revered in Ayurveda for its powerful immune-boosting and stress-relieving properties.",
    image: "https://images.unsplash.com/photo-1583824003700-1a59c01a18a0?w=600&q=80",
    category: "Herbs & Spices",
    readTime: "6 min read",
    slug: "tulsi-queen-of-herbs",
  },
  {
    id: "15",
    title: "Ayurvedic Evening Routine for Better Sleep",
    excerpt: "Wind down properly with these calming Ayurvedic practices to ensure deep, restful sleep every night.",
    image: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?w=600&q=80",
    category: "Lifestyle",
    readTime: "7 min read",
    slug: "ayurvedic-evening-routine",
  },
];

// Before/After Transformation Data
export const beforeAfterData = {
  beforeImage: "https://images.unsplash.com/photo-1609840114035-3c981a782dfe?w=1200&q=80",
  afterImage: "https://images.unsplash.com/photo-1556229010-aa9e327aad63?w=1200&q=80",
  beforeLabel: "Before",
  afterLabel: "After",
  title: "Real Results from Real People",
  subtitle: "See the transformative power of Ayurveda with our natural skincare and wellness products",
};

// Video Testimonials Data
export const videoTestimonials = [
  {
    id: "v1",
    videoUrl: "https://kosmico.econextechnologies.com/wp-content/uploads/2026/01/real-video-4.mp4",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
    caption: "Authentic Ayurvedic Living",
    customerName: "Real Customer Story",
    rating: 5,
  },
  {
    id: "v2",
    videoUrl: "https://kosmico.econextechnologies.com/wp-content/uploads/2026/01/real-video-3.mp4",
    thumbnail: "https://images.unsplash.com/photo-1512290923902-8a9f81dc206e?w=600&q=80",
    caption: "Visible Results | New Future",
    customerName: "Wellness Journey",
    rating: 5,
  },
  {
    id: "v3",
    videoUrl: "https://kosmico.econextechnologies.com/wp-content/uploads/2026/01/dibe-care.mp4",
    thumbnail: "https://images.unsplash.com/photo-1559839734-2b71f1e3c77d?w=600&q=80",
    caption: "Diabetes Control: Natural Solution",
    customerName: "Diabetes Care User",
    rating: 5,
  },
];
