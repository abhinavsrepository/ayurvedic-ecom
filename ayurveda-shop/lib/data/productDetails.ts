import { Product } from "@/components/product/ProductCard";

export interface ProductDetail extends Product {
  images: string[];
  longDescription: string;
  ingredients: string[];
  benefits: string[];
  howToUse: string[];
  dosage?: string;
  warnings?: string[];
  certifications: string[];
  faq: { question: string; answer: string }[];
  variants?: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    inStock: boolean;
  }[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userImage?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

export const productDetailsData: Record<string, ProductDetail> = {
  "ayurvedic-hair-oil": {
    id: "1",
    name: "Ayurvedic Hair Oil",
    slug: "ayurvedic-hair-oil",
    description: "Premium Ayurvedic hair oil with bhringraj, amla, and hibiscus for thick, lustrous hair growth.",
    longDescription: "Our Ayurvedic Hair Oil is a time-tested formula that combines the power of ancient herbs to nourish your hair from root to tip. Made with pure cold-pressed coconut oil as a base, this potent blend includes Bhringraj (the 'King of Herbs' for hair), Amla (Indian Gooseberry rich in Vitamin C), and Hibiscus flowers. These ingredients work synergistically to promote hair growth, prevent premature graying, reduce hair fall, and add natural shine and volume. Free from harmful chemicals, parabens, and synthetic fragrances, this oil is suitable for all hair types and can be used by both men and women.",
    price: 649,
    originalPrice: 799,
    image: "/images/hair oil.png",
    images: [
      "/images/hair oil.png",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80",
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80",
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80",
    ],
    category: "Hair Care",
    inStock: true,
    isBestseller: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 345,
    doshaType: "all",
    ingredients: [
      "Bhringraj (Eclipta Alba) - 20%",
      "Amla (Phyllanthus Emblica) - 15%",
      "Hibiscus (Hibiscus Rosa-sinensis) - 10%",
      "Brahmi (Bacopa Monnieri) - 8%",
      "Neem (Azadirachta Indica) - 7%",
      "Curry Leaves (Murraya Koenigii) - 5%",
      "Fenugreek (Trigonella Foenum-graecum) - 5%",
      "Coconut Oil (Base) - 30%"
    ],
    benefits: [
      "Promotes natural hair growth and thickness",
      "Reduces hair fall and breakage significantly",
      "Prevents premature graying of hair",
      "Nourishes scalp and strengthens hair roots",
      "Adds natural shine and luster",
      "Controls dandruff and scalp infections",
      "Reduces split ends and frizz",
      "Suitable for all hair types"
    ],
    howToUse: [
      "Warm the oil slightly for better absorption",
      "Part your hair into sections",
      "Apply oil to scalp and massage gently in circular motions for 5-10 minutes",
      "Work the remaining oil through the length of your hair",
      "Leave it on for at least 2 hours or overnight for best results",
      "Wash with a mild herbal shampoo",
      "Use 2-3 times a week for optimal results"
    ],
    warnings: [
      "For external use only",
      "Avoid contact with eyes",
      "Patch test recommended before first use",
      "Keep out of reach of children",
      "Store in a cool, dry place away from direct sunlight",
      "Discontinue use if irritation occurs"
    ],
    certifications: ["100% Natural", "Chemical-Free", "Cruelty-Free", "Ayush Certified"],
    faq: [
      {
        question: "How long does it take to see results?",
        answer: "Most users notice reduced hair fall within 2-3 weeks of regular use. Visible hair growth and thickness improvements typically appear after 6-8 weeks of consistent application."
      },
      {
        question: "Can I use this oil on colored or treated hair?",
        answer: "Yes, this oil is safe for colored and chemically treated hair. In fact, it helps repair damage caused by chemical treatments."
      },
      {
        question: "Does it have a strong smell?",
        answer: "The oil has a mild, natural herbal fragrance. It's not overpowering and dissipates after washing."
      },
      {
        question: "Is it suitable for oily scalp?",
        answer: "Yes, despite being an oil, it helps balance scalp sebum production. Start with a small amount and focus on the scalp."
      }
    ],
    variants: [
      {
        id: "hair-oil-100ml",
        name: "100ml Bottle",
        price: 649,
        originalPrice: 799,
        inStock: true
      },
      {
        id: "hair-oil-200ml",
        name: "200ml Bottle",
        price: 1199,
        originalPrice: 1499,
        inStock: true
      },
      {
        id: "hair-oil-500ml",
        name: "500ml Bottle (Family Pack)",
        price: 2499,
        originalPrice: 3199,
        inStock: true
      }
    ]
  },
  "diabetes-care-supplement": {
    id: "3",
    name: "Diabetes Care Supplement",
    slug: "diabetes-care-supplement",
    description: "Ayurvedic herbal formula with karela, jamun, and gudmar to support healthy blood sugar levels naturally.",
    longDescription: "Our Diabetes Care Supplement is a scientifically formulated Ayurvedic blend designed to support healthy blood sugar management. This powerful combination features Karela (Bitter Gourd) known for its hypoglycemic properties, Jamun (Indian Blackberry) seeds that help regulate glucose metabolism, and Gudmar (Gymnema Sylvestre) which reduces sugar cravings and supports insulin production. Enriched with Methi (Fenugreek) and Vijaysar, this supplement works holistically to maintain optimal blood sugar levels, improve insulin sensitivity, and support pancreatic health. Ideal for pre-diabetics and diabetics looking for natural blood sugar management alongside their prescribed treatment.",
    price: 599,
    originalPrice: 749,
    image: "/images/diabetes care.jpeg",
    images: [
      "/images/diabetes care.jpeg",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
    ],
    category: "Supplements",
    inStock: true,
    rating: 4.7,
    reviewCount: 198,
    doshaType: "all",
    ingredients: [
      "Karela Extract (Momordica Charantia) - 250mg",
      "Jamun Seed Powder (Syzygium Cumini) - 200mg",
      "Gudmar Extract (Gymnema Sylvestre) - 150mg",
      "Methi Seeds (Trigonella Foenum-graecum) - 100mg",
      "Vijaysar Extract (Pterocarpus Marsupium) - 100mg",
      "Giloy Extract (Tinospora Cordifolia) - 50mg",
      "Triphala Powder - 50mg"
    ],
    benefits: [
      "Supports healthy blood sugar levels",
      "Improves insulin sensitivity naturally",
      "Reduces sugar cravings and appetite",
      "Supports pancreatic function",
      "Helps maintain healthy glucose metabolism",
      "Reduces diabetes-related fatigue",
      "Supports cardiovascular health",
      "100% natural with no side effects"
    ],
    howToUse: [
      "Take 1-2 capsules twice daily",
      "Consume 30 minutes before meals with water",
      "For best results, maintain a diabetic-friendly diet",
      "Regular exercise enhances effectiveness",
      "Monitor blood sugar levels regularly",
      "Continue for at least 3 months for optimal results"
    ],
    dosage: "2 capsules twice daily (morning and evening) before meals. Do not exceed 4 capsules per day.",
    warnings: [
      "Consult your doctor before use if on diabetes medication",
      "Not a replacement for prescribed diabetes medication",
      "Pregnant and nursing women should consult a physician",
      "Monitor blood sugar levels regularly while using",
      "Keep out of reach of children",
      "Store in a cool, dry place"
    ],
    certifications: ["FSSAI Approved", "GMP Certified", "Ayush Certified", "100% Natural"],
    faq: [
      {
        question: "Can I stop my diabetes medication after using this?",
        answer: "No, this is a supplement that supports blood sugar management. Never stop prescribed medication without consulting your doctor. Use this alongside your treatment plan."
      },
      {
        question: "How long before I see results?",
        answer: "Most users notice improved energy levels within 2-3 weeks. For blood sugar stabilization, consistent use for 2-3 months is recommended along with diet and exercise."
      },
      {
        question: "Is it safe for Type 1 diabetes?",
        answer: "While the ingredients are natural, Type 1 diabetics should consult their endocrinologist before use as it's primarily formulated for Type 2 diabetes support."
      }
    ],
    variants: [
      {
        id: "diabetes-60",
        name: "60 Capsules (1 Month)",
        price: 599,
        originalPrice: 749,
        inStock: true
      },
      {
        id: "diabetes-120",
        name: "120 Capsules (2 Months)",
        price: 1099,
        originalPrice: 1399,
        inStock: true
      }
    ]
  },
  "ayurvedic-cough-syrup": {
    id: "2",
    name: "Ayurvedic Cough Syrup",
    slug: "ayurvedic-cough-syrup",
    description: "Natural herbal cough syrup with tulsi, ginger, and honey for respiratory relief and throat soothing.",
    longDescription: "Our Ayurvedic Cough Syrup is a time-tested formula that provides natural relief from cough, cold, and throat irritation. Formulated with Tulsi (Holy Basil) known for its antimicrobial properties, fresh Ginger that soothes the throat, pure Honey that coats and heals, and Mulethi (Licorice) that acts as a natural expectorant. This alcohol-free syrup is safe for all age groups and provides quick relief from dry cough, wet cough, and seasonal allergies. Unlike chemical cough syrups, our herbal blend not only suppresses cough but also boosts immunity and addresses the root cause of respiratory discomfort.",
    price: 299,
    originalPrice: 399,
    image: "/images/coughsyrup.jpeg",
    images: [
      "/images/coughsyrup.jpeg",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80",
    ],
    category: "Supplements",
    inStock: true,
    isBestseller: true,
    rating: 4.8,
    reviewCount: 234,
    doshaType: "all",
    ingredients: [
      "Tulsi Extract (Ocimum Sanctum) - 15%",
      "Ginger Juice (Zingiber Officinale) - 10%",
      "Pure Honey - 20%",
      "Mulethi Extract (Glycyrrhiza Glabra) - 12%",
      "Vasaka (Adhatoda Vasica) - 10%",
      "Kantkari (Solanum Xanthocarpum) - 8%",
      "Pippali (Long Pepper) - 5%",
      "Sugar Base - 20%"
    ],
    benefits: [
      "Provides quick relief from dry and wet cough",
      "Soothes throat irritation and inflammation",
      "Acts as natural expectorant",
      "Boosts respiratory immunity",
      "Safe for children and adults",
      "No drowsiness or side effects",
      "Helps with seasonal allergies",
      "Pleasant taste, easy to consume"
    ],
    howToUse: [
      "Adults: Take 2 teaspoons (10ml) three times daily",
      "Children (5-12 years): Take 1 teaspoon (5ml) three times daily",
      "Children (2-5 years): Take 1/2 teaspoon (2.5ml) three times daily",
      "Take after meals for best results",
      "Can be taken directly or mixed with lukewarm water",
      "Shake well before use",
      "Continue for 7-10 days or as needed"
    ],
    dosage: "Adults: 10ml thrice daily. Children: As per age recommendation above.",
    warnings: [
      "Not recommended for children below 2 years",
      "Diabetics should consult a doctor (contains sugar)",
      "If cough persists beyond 2 weeks, consult a physician",
      "Store in a cool place, away from direct sunlight",
      "Use within 6 months of opening",
      "Do not refrigerate"
    ],
    certifications: ["Alcohol-Free", "100% Natural", "FSSAI Approved", "Ayush Certified"],
    faq: [
      {
        question: "Is it safe for children?",
        answer: "Yes, it's safe for children above 2 years of age. Follow the age-appropriate dosage mentioned on the label. The natural ingredients make it gentle and effective."
      },
      {
        question: "Does it cause drowsiness?",
        answer: "No, unlike chemical cough syrups, this herbal formula does not contain sedatives and won't cause drowsiness or affect daily activities."
      },
      {
        question: "Can I take it with other medications?",
        answer: "Yes, it's generally safe to take with other medications. However, if you're on prescription drugs, consult your doctor to avoid any interactions."
      }
    ],
    variants: [
      {
        id: "cough-100ml",
        name: "100ml Bottle",
        price: 299,
        originalPrice: 399,
        inStock: true
      },
      {
        id: "cough-200ml",
        name: "200ml Bottle",
        price: 549,
        originalPrice: 699,
        inStock: true
      }
    ]
  },
  "liver-care-capsules": {
    id: "5",
    name: "Liver Care Capsules",
    slug: "liver-care-capsules",
    description: "Protective liver support with kutki, punarnava, and bhumi amla for detoxification and liver health.",
    longDescription: "Our Liver Care Capsules are expertly formulated to support optimal liver function and promote natural detoxification. This powerful blend features Kutki (Picrorhiza Kurroa), a potent hepatoprotective herb, Punarnava (Boerhavia Diffusa) known for its regenerative properties, and Bhumi Amla (Phyllanthus Niruri) which protects liver cells from damage. Also enriched with Kalmegh and Giloy, this supplement helps in liver detoxification, reduces fatty liver, protects against hepatitis, and improves overall liver enzyme levels. Ideal for those exposed to alcohol, medication, or environmental toxins, as well as for general liver health maintenance.",
    price: 549,
    originalPrice: 699,
    image: "/images/live care.jpeg",
    images: [
      "/images/live care.jpeg",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80",
    ],
    category: "Supplements",
    inStock: true,
    rating: 4.6,
    reviewCount: 78,
    doshaType: "all",
    ingredients: [
      "Kutki Extract (Picrorhiza Kurroa) - 200mg",
      "Punarnava Extract (Boerhavia Diffusa) - 150mg",
      "Bhumi Amla (Phyllanthus Niruri) - 150mg",
      "Kalmegh Extract (Andrographis Paniculata) - 100mg",
      "Giloy Extract (Tinospora Cordifolia) - 100mg",
      "Makoy (Solanum Nigrum) - 50mg",
      "Kasni (Cichorium Intybus) - 50mg"
    ],
    benefits: [
      "Supports healthy liver function",
      "Promotes natural detoxification",
      "Reduces fatty liver accumulation",
      "Protects liver cells from damage",
      "Improves digestion and metabolism",
      "Helps maintain healthy liver enzyme levels",
      "Supports alcohol-related liver stress",
      "Boosts overall immunity"
    ],
    howToUse: [
      "Take 1-2 capsules twice daily",
      "Consume 30 minutes before meals with water",
      "For detox: Take for 3 months continuously",
      "Maintain a healthy diet low in alcohol and processed foods",
      "Stay hydrated throughout the day",
      "Regular use recommended for chronic liver conditions"
    ],
    dosage: "2 capsules twice daily. For maintenance: 1 capsule daily.",
    warnings: [
      "Consult a doctor if you have severe liver disease",
      "Not recommended during pregnancy and breastfeeding",
      "If on medication, consult your physician",
      "Regular liver function tests recommended for chronic conditions",
      "Store in a cool, dry place",
      "Keep out of reach of children"
    ],
    certifications: ["GMP Certified", "FSSAI Approved", "100% Natural", "Ayush Certified"],
    faq: [
      {
        question: "Can this cure fatty liver?",
        answer: "While it significantly supports liver health and reduces fat accumulation, it works best alongside dietary changes and lifestyle modifications. Consistent use for 3-6 months shows significant improvement."
      },
      {
        question: "Is it safe for long-term use?",
        answer: "Yes, all ingredients are natural and safe for long-term use. Many users take it as a maintenance supplement for overall liver health."
      },
      {
        question: "Can I take it with alcohol?",
        answer: "While the supplement supports liver health, we recommend reducing or avoiding alcohol consumption for best results and overall liver protection."
      }
    ],
    variants: [
      {
        id: "liver-60",
        name: "60 Capsules",
        price: 549,
        originalPrice: 699,
        inStock: true
      },
      {
        id: "liver-120",
        name: "120 Capsules (2 Months)",
        price: 999,
        originalPrice: 1299,
        inStock: true
      }
    ]
  },
  "liver-oil-extract": {
    id: "6",
    name: "Liver Oil Extract",
    slug: "liver-oil-extract",
    description: "Concentrated liver oil with omega fatty acids and Ayurvedic herbs for liver regeneration.",
    longDescription: "Our Liver Oil Extract is a unique Ayurvedic formulation that combines the power of cold-pressed herbal oils with liver-supportive herbs. This concentrated blend features Omega-3 and Omega-6 fatty acids essential for liver cell regeneration, combined with extracts of Kutki, Bhringraj, and Amla. The oil base ensures better absorption of fat-soluble nutrients and herbs, providing superior bioavailability. This potent extract helps in liver regeneration, reduces inflammation, supports bile production, and protects liver cells from oxidative stress. Particularly beneficial for fatty liver, hepatitis recovery, and overall liver vitality.",
    price: 749,
    originalPrice: 899,
    image: "/images/liver oil.jpeg",
    images: [
      "/images/liver oil.jpeg",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80",
    ],
    category: "Essential Oils",
    inStock: true,
    rating: 4.5,
    reviewCount: 89,
    doshaType: "all",
    ingredients: [
      "Cold-Pressed Flaxseed Oil - 30%",
      "Evening Primrose Oil - 20%",
      "Kutki Oil Extract - 15%",
      "Bhringraj Oil - 10%",
      "Amla Extract in Oil - 10%",
      "Milk Thistle Oil - 10%",
      "Vitamin E (Natural) - 5%"
    ],
    benefits: [
      "Supports liver cell regeneration",
      "Rich in Omega-3 and Omega-6 fatty acids",
      "Reduces liver inflammation",
      "Enhances bile production",
      "Protects against oxidative stress",
      "Improves liver enzyme levels",
      "Better absorption than tablets",
      "Supports fatty liver recovery"
    ],
    howToUse: [
      "Take 1 teaspoon (5ml) twice daily",
      "Can be mixed with juice, milk, or smoothies",
      "Best taken with meals for optimal absorption",
      "Shake well before use",
      "For intensive care: Take with warm water in the morning",
      "Continue for minimum 2-3 months for best results"
    ],
    dosage: "1 teaspoon (5ml) twice daily with meals. Can be increased to 3 times daily for intensive liver support.",
    warnings: [
      "Keep refrigerated after opening",
      "Use within 3 months of opening",
      "Not recommended for children below 12 years",
      "Pregnant and nursing women should consult a doctor",
      "If on blood thinners, consult physician",
      "Do not heat or cook with this oil"
    ],
    certifications: ["Cold-Pressed", "100% Natural", "No Preservatives", "FSSAI Approved"],
    faq: [
      {
        question: "What's the difference between this and liver capsules?",
        answer: "The oil format provides better absorption of fat-soluble nutrients and herbs. It's more potent and works faster, especially for severe liver conditions."
      },
      {
        question: "Does it have a strong taste?",
        answer: "It has a mild herbal taste. You can mix it with orange juice or smoothies to mask the flavor if needed."
      },
      {
        question: "Can I apply it externally?",
        answer: "No, this is formulated for internal consumption only. Do not apply on skin."
      }
    ],
    variants: [
      {
        id: "liver-oil-100ml",
        name: "100ml Bottle",
        price: 749,
        originalPrice: 899,
        inStock: true
      },
      {
        id: "liver-oil-200ml",
        name: "200ml Bottle",
        price: 1299,
        originalPrice: 1599,
        inStock: true
      }
    ]
  },
  "active-protein-powder": {
    id: "4",
    name: "Active Protein Powder",
    slug: "active-protein-powder",
    description: "Herbal protein blend with ashwagandha, shatavari, and moringa for muscle strength and vitality.",
    longDescription: "Our Active Protein Powder is a revolutionary Ayurvedic supplement that combines plant-based proteins with powerful adaptogens. This unique formula includes Ashwagandha (for strength and recovery), Shatavari (for hormonal balance), Moringa (superfood packed with amino acids), and Pea Protein (complete protein source). Unlike conventional protein powders, our blend not only builds muscle but also supports overall vitality, reduces stress, improves digestion, and enhances immunity. Perfect for fitness enthusiasts, athletes, yoga practitioners, and anyone looking to maintain healthy muscle mass naturally.",
    price: 899,
    originalPrice: 1099,
    image: "/images/active protein.jpeg",
    images: [
      "/images/active protein.jpeg",
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80",
      "https://images.unsplash.com/photo-1579722821273-0f6c7d4edbf7?w=800&q=80",
      "https://images.unsplash.com/photo-1556817411-58c45dd94e8c?w=800&q=80",
    ],
    category: "Supplements",
    inStock: true,
    isNew: true,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 312,
    doshaType: "all",
    ingredients: [
      "Pea Protein Isolate - 40%",
      "Ashwagandha (Withania Somnifera) - 15%",
      "Moringa (Moringa Oleifera) - 12%",
      "Shatavari (Asparagus Racemosus) - 10%",
      "Spirulina - 8%",
      "Flaxseed Powder - 5%",
      "Chia Seeds Powder - 5%",
      "Natural Vanilla Flavor - 5%"
    ],
    benefits: [
      "Provides 25g protein per serving",
      "Builds lean muscle mass naturally",
      "Reduces post-workout recovery time",
      "Boosts energy and stamina",
      "Supports hormonal balance",
      "Enhances immunity and gut health",
      "Reduces stress and anxiety",
      "100% plant-based and vegan-friendly"
    ],
    howToUse: [
      "Mix 1-2 scoops (30-60g) with 250-300ml of water, milk, or plant-based milk",
      "Shake or blend well until smooth",
      "Consume within 30 minutes post-workout for muscle recovery",
      "Can also be taken in the morning as a nutritious breakfast shake",
      "For best results, use daily along with a balanced diet and exercise"
    ],
    dosage: "1-2 scoops daily. Do not exceed 3 scoops per day.",
    warnings: [
      "Consult your healthcare provider before use if pregnant or nursing",
      "Not recommended for children under 12 years",
      "Keep container tightly closed after use",
      "Store in a cool, dry place",
      "Use within 3 months of opening"
    ],
    certifications: ["100% Plant-Based", "Vegan", "Gluten-Free", "Non-GMO", "FSSAI Approved"],
    faq: [
      {
        question: "How is this different from regular whey protein?",
        answer: "Unlike whey protein, our formula is 100% plant-based, easier to digest, and includes adaptogenic herbs that support overall wellness, not just muscle building."
      },
      {
        question: "Will this help with weight loss?",
        answer: "Yes, high protein intake helps with satiety and maintains muscle mass during weight loss. Combine with calorie-controlled diet and exercise for best results."
      },
      {
        question: "Can women use this protein powder?",
        answer: "Absolutely! This formula is designed for both men and women. Shatavari specifically supports women's hormonal health."
      },
      {
        question: "Does it taste chalky?",
        answer: "No, we've perfected a smooth, naturally vanilla-flavored formula that mixes easily without any chalky texture."
      }
    ],
    variants: [
      {
        id: "protein-500g",
        name: "500g (17 servings)",
        price: 899,
        originalPrice: 1099,
        inStock: true
      },
      {
        id: "protein-1kg",
        name: "1kg (33 servings)",
        price: 1599,
        originalPrice: 1999,
        inStock: true
      }
    ]
  }
};

export const productReviews: Record<string, Review[]> = {
  "ayurvedic-hair-oil": [
    {
      id: "r1",
      productId: "1",
      userName: "Priya Sharma",
      userImage: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      title: "Best hair oil I've ever used!",
      comment: "I've been using this oil for 3 months now and the results are amazing. My hair fall has reduced by 80% and I can see new baby hairs growing. The texture is not too heavy and doesn't make my scalp greasy. Highly recommend!",
      date: "2025-01-05",
      verified: true,
      helpful: 42,
      images: []
    },
    {
      id: "r2",
      productId: "1",
      userName: "Rahul Verma",
      userImage: "https://i.pravatar.cc/150?img=12",
      rating: 5,
      title: "Visible results in 6 weeks",
      comment: "I was skeptical at first, but this oil actually works! My receding hairline has improved and my hair feels much thicker. The natural ingredients give me peace of mind.",
      date: "2025-01-02",
      verified: true,
      helpful: 28
    },
    {
      id: "r3",
      productId: "1",
      userName: "Anjali Reddy",
      rating: 4,
      title: "Good product, mild fragrance",
      comment: "The oil works well and has helped with my dandruff issues. Only reason for 4 stars is the bottle could be better designed. Otherwise, great product!",
      date: "2024-12-28",
      verified: true,
      helpful: 15
    }
  ],
  "active-protein-powder": [
    {
      id: "r4",
      productId: "4",
      userName: "Vikram Singh",
      userImage: "https://i.pravatar.cc/150?img=13",
      rating: 5,
      title: "Perfect for my fitness goals",
      comment: "Finally, a protein powder that doesn't upset my stomach! The ashwagandha gives me sustained energy throughout the day. Gained 3kg of lean muscle in 2 months with regular gym and this powder.",
      date: "2025-01-08",
      verified: true,
      helpful: 35
    },
    {
      id: "r5",
      productId: "4",
      userName: "Meera Patel",
      userImage: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      title: "Best plant-based protein!",
      comment: "As a vegan, finding good protein sources is challenging. This powder is amazing - mixes well, tastes great, and I feel more energetic. Love that it has shatavari for hormonal balance!",
      date: "2025-01-03",
      verified: true,
      helpful: 29
    }
  ],
  "diabetes-care-supplement": [
    {
      id: "r6",
      productId: "3",
      userName: "Ramesh Kumar",
      userImage: "https://i.pravatar.cc/150?img=14",
      rating: 5,
      title: "Helped control my sugar levels",
      comment: "Been using this for 3 months along with diet control. My fasting sugar has come down from 180 to 110. Very effective and no side effects!",
      date: "2025-01-06",
      verified: true,
      helpful: 22
    }
  ],
  "ayurvedic-cough-syrup": [
    {
      id: "r7",
      productId: "2",
      userName: "Sneha Iyer",
      userImage: "https://i.pravatar.cc/150?img=9",
      rating: 5,
      title: "Works better than chemical syrups",
      comment: "My kids love the taste and it really helps with their cough. Natural ingredients give me peace of mind. Highly recommended!",
      date: "2025-01-04",
      verified: true,
      helpful: 18
    }
  ],
  "liver-care-capsules": [
    {
      id: "r8",
      productId: "5",
      userName: "Anil Gupta",
      userImage: "https://i.pravatar.cc/150?img=15",
      rating: 4,
      title: "Good for liver detox",
      comment: "Been taking this for a month. Feel more energetic and my digestion has improved. Takes time to show results but worth it.",
      date: "2025-01-01",
      verified: true,
      helpful: 12
    }
  ],
  "liver-oil-extract": [
    {
      id: "r9",
      productId: "6",
      userName: "Kavita Menon",
      userImage: "https://i.pravatar.cc/150?img=10",
      rating: 5,
      title: "Excellent quality oil",
      comment: "Pure and effective. I mix it with my morning juice. Has helped with my fatty liver condition significantly.",
      date: "2024-12-30",
      verified: true,
      helpful: 15
    }
  ]
};

export function getProductDetail(slug: string): ProductDetail | undefined {
  return productDetailsData[slug];
}

export function getProductReviews(slug: string): Review[] {
  return productReviews[slug] || [];
}
