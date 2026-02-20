import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

// Load environment variables
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined. Please check your .env file.');
}

// Create PostgreSQL connection pool
const pool = new Pool({
    connectionString: databaseUrl,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Initialize PrismaClient with adapter
const prisma = new PrismaClient({
    adapter,
});

async function main() {
    const hashedPassword = await bcrypt.hash('Test@1234', 10);

    // Create Roles
    const adminRole = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: {
            name: 'ADMIN',
            description: 'Administrator with full access',
        },
    });

    const userRole = await prisma.role.upsert({
        where: { name: 'USER' },
        update: {},
        create: {
            name: 'USER',
            description: 'Standard user',
        },
    });

    // Create or Update Admin User (resets password on reseed)
    const adminUser = await prisma.user.upsert({
        where: { username: 'admin@ayurveda.com' },
        update: {
            password: hashedPassword,
            enabled: true,
            account_locked: false,
            failed_login_attempts: 0,
        },
        create: {
            username: 'admin@ayurveda.com',
            email: 'admin@ayurshop.com',
            password: hashedPassword,
            full_name: 'System Administrator',
            enabled: true,
            user_roles: {
                create: {
                    role_id: adminRole.id,
                },
            },
        },
    });
    
    console.log('✅ Admin user created/updated:');
    console.log('   Username: admin@ayurveda.com');
    console.log('   Password: Test@1234');
    console.log('   Email: admin@ayurshop.com');

    // Create Sample Products
    const products = [
        {
            sku: 'AYUR-HAIR-001',
            name: 'Ayurvedic Hair Oil',
            slug: 'ayurvedic-hair-oil',
            description: 'Nourishing Ayurvedic hair oil made with natural herbs like Bhringraj, Amla, and Brahmi. Promotes hair growth, reduces hair fall, and strengthens roots.',
            short_description: 'Natural hair oil with Bhringraj and Amla for healthy hair growth',
            price: 299.00,
            compare_at_price: 399.00,
            status: 'ACTIVE',
            category: 'Hair Care',
            subcategory: 'Hair Oils',
            brand: 'AyurHerbs',
            weight_grams: 200,
            is_featured: true,
            ingredients: 'Bhringraj, Amla, Brahmi, Coconut Oil, Sesame Oil, Neem, Hibiscus',
            benefits: 'Promotes hair growth, Reduces hair fall, Strengthens hair roots, Prevents dandruff, Adds natural shine',
            usage_instructions: 'Apply generously to scalp and hair. Massage gently for 10-15 minutes. Leave overnight or for at least 2 hours before washing. Use 2-3 times a week for best results.',
            seo_title: 'Ayurvedic Hair Oil - Natural Hair Growth Treatment',
            seo_description: 'Buy authentic Ayurvedic hair oil with Bhringraj and Amla. Promotes hair growth and reduces hair fall naturally.',
        },
        {
            sku: 'AYUR-FACE-001',
            name: 'Kumkumadi Face Serum',
            slug: 'kumkumadi-face-serum',
            description: 'Luxurious Kumkumadi Tailam face serum with pure saffron and 24 herbs. Brightens complexion, reduces dark spots, and gives a natural glow.',
            short_description: 'Luxury face serum with saffron for glowing skin',
            price: 599.00,
            compare_at_price: 799.00,
            status: 'ACTIVE',
            category: 'Skin Care',
            subcategory: 'Face Serums',
            brand: 'AyurGlow',
            weight_grams: 30,
            is_featured: true,
            ingredients: 'Saffron, Sandalwood, Turmeric, Lotus Extract, Manjistha, Licorice, Sesame Oil',
            benefits: 'Brightens skin tone, Reduces dark spots and pigmentation, Anti-aging properties, Natural glow, Improves skin texture',
            usage_instructions: 'Apply 3-4 drops on cleansed face and neck. Massage gently in upward circular motions. Use daily at night before bedtime.',
            seo_title: 'Kumkumadi Face Serum - Saffron Skin Brightening Oil',
            seo_description: 'Authentic Kumkumadi Tailam with pure saffron. Brightens skin and reduces dark spots naturally.',
        },
        {
            sku: 'AYUR-TEA-001',
            name: 'Digestive Herbal Tea',
            slug: 'digestive-herbal-tea',
            description: 'Soothing herbal tea blend with ginger, fennel, and peppermint. Supports healthy digestion and reduces bloating. Caffeine-free.',
            short_description: 'Caffeine-free digestive tea with ginger and fennel',
            price: 199.00,
            compare_at_price: 249.00,
            status: 'ACTIVE',
            category: 'Wellness',
            subcategory: 'Herbal Teas',
            brand: 'AyurTea',
            weight_grams: 100,
            is_featured: false,
            ingredients: 'Ginger, Fennel Seeds, Peppermint Leaves, Coriander Seeds, Cumin, Ajwain',
            benefits: 'Improves digestion, Reduces bloating and gas, Soothes stomach, Detoxifies body, Caffeine-free',
            usage_instructions: 'Steep 1 teaspoon in hot water for 5-7 minutes. Drink after meals or whenever needed. Best consumed warm.',
            seo_title: 'Digestive Herbal Tea - Ayurvedic Digestion Support',
            seo_description: 'Natural digestive tea with ginger and fennel. Helps with bloating and supports healthy digestion.',
        },
        {
            sku: 'AYUR-SOAP-001',
            name: 'Neem & Tulsi Soap',
            slug: 'neem-tulsi-soap',
            description: 'Handcrafted Ayurvedic soap with pure neem and tulsi extracts. Antibacterial properties help treat acne and skin infections. Suitable for all skin types.',
            short_description: 'Handcrafted antibacterial soap with neem and tulsi',
            price: 89.00,
            compare_at_price: 120.00,
            status: 'ACTIVE',
            category: 'Bath & Body',
            subcategory: 'Soaps',
            brand: 'AyurPure',
            weight_grams: 100,
            is_featured: false,
            ingredients: 'Neem Extract, Tulsi Extract, Coconut Oil, Olive Oil, Glycerin, Essential Oils',
            benefits: 'Antibacterial protection, Treats acne, Purifies skin, Natural fragrance, Chemical-free',
            usage_instructions: 'Wet skin and lather soap. Apply on face and body. Rinse thoroughly. For external use only.',
            seo_title: 'Neem & Tulsi Soap - Natural Antibacterial Soap',
            seo_description: 'Handcrafted neem and tulsi soap. Natural antibacterial protection for healthy skin.',
        },
        {
            sku: 'AYUR-MASSAGE-001',
            name: 'Pain Relief Massage Oil',
            slug: 'pain-relief-massage-oil',
            description: 'Therapeutic massage oil with Mahanarayan oil blend. Relieves joint pain, muscle soreness, and stiffness. Ideal for arthritis and sports injuries.',
            short_description: 'Therapeutic oil for joint and muscle pain relief',
            price: 349.00,
            compare_at_price: 449.00,
            status: 'ACTIVE',
            category: 'Pain Relief',
            subcategory: 'Massage Oils',
            brand: 'AyurRelief',
            weight_grams: 200,
            is_featured: true,
            ingredients: 'Ashwagandha, Shatavari, Bala, Sesame Oil, Camphor, Menthol, Eucalyptus',
            benefits: 'Relieves joint pain, Reduces muscle stiffness, Improves blood circulation, Anti-inflammatory, Relieves arthritis pain',
            usage_instructions: 'Warm the oil slightly. Massage affected areas gently for 15-20 minutes. Use twice daily for best results.',
            seo_title: 'Pain Relief Massage Oil - Ayurvedic Joint Pain Solution',
            seo_description: 'Effective pain relief oil with Mahanarayan blend. Relieves joint pain and muscle soreness naturally.',
        },
        {
            sku: 'AYUR-CHYAWANPRASH-001',
            name: 'Chyawanprash Immunity Booster',
            slug: 'chyawanprash-immunity-booster',
            description: 'Traditional Chyawanprash made with 40+ herbs and Amla. Boosts immunity, improves digestion, and enhances overall vitality. Suitable for all ages.',
            short_description: 'Traditional immunity booster with 40+ herbs',
            price: 449.00,
            compare_at_price: 549.00,
            status: 'ACTIVE',
            category: 'Wellness',
            subcategory: 'Supplements',
            brand: 'AyurVita',
            weight_grams: 500,
            is_featured: true,
            ingredients: 'Amla, Ashwagandha, Pippali, Cardamom, Cinnamon, Saffron, Ghee, Honey, 35+ Ayurvedic Herbs',
            benefits: 'Boosts immunity, Improves digestion, Enhances vitality, Rich in Vitamin C, Anti-aging properties',
            usage_instructions: 'Take 1-2 teaspoons daily with warm milk or water. Best taken in the morning on empty stomach.',
            seo_title: 'Chyawanprash Immunity Booster - 40+ Herbs',
            seo_description: 'Authentic Chyawanprash with 40+ herbs and Amla. Boosts immunity and enhances vitality naturally.',
        },
    ];

    for (const product of products) {
        const createdProduct = await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: product,
        });
        console.log(`✅ Created product: ${createdProduct.name}`);
    }

    console.log(`\n✅ Seeded ${products.length} products successfully!`);

    // Create Sample Blog Posts
    const blogPosts = [
        {
            title: 'The Ancient Wisdom of Ayurveda: A Complete Guide',
            slug: 'ancient-wisdom-ayurveda-complete-guide',
            excerpt: 'Discover the 5,000-year-old healing system that balances mind, body, and spirit through natural remedies and lifestyle practices.',
            content: `<h2>What is Ayurveda?</h2>
<p>Ayurveda, which translates to "the science of life" (Ayur = life, Veda = science or knowledge), is one of the world's oldest holistic healing systems. Developed more than 5,000 years ago in India, this ancient practice is based on the belief that health and wellness depend on a delicate balance between the mind, body, and spirit.</p>

<h2>The Three Doshas</h2>
<p>According to Ayurvedic principles, everything in the universe is composed of five elements: space, air, fire, water, and earth. These elements combine to form three life forces or energies, called doshas:</p>
<ul>
<li><strong>Vata (Space + Air):</strong> Governs movement and communication</li>
<li><strong>Pitta (Fire + Water):</strong> Controls digestion and metabolism</li>
<li><strong>Kapha (Earth + Water):</strong> Maintains structure and stability</li>
</ul>

<h2>Benefits of Ayurvedic Practices</h2>
<p>Regular Ayurvedic practices can help:</p>
<ul>
<li>Reduce stress and anxiety</li>
<li>Improve digestion and metabolism</li>
<li>Enhance sleep quality</li>
<li>Boost immunity naturally</li>
<li>Maintain healthy weight</li>
<li>Promote overall well-being</li>
</ul>

<h2>Getting Started with Ayurveda</h2>
<p>Begin your Ayurvedic journey by understanding your dominant dosha through a consultation with a qualified practitioner. Incorporate daily routines (dinacharya), proper nutrition, herbal supplements, and mindfulness practices into your lifestyle.</p>`,
            featured_image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800',
            author_id: adminUser.id,
            category: 'Wellness',
            status: 'PUBLISHED',
            published_at: new Date('2026-01-15'),
            seo_title: 'Ancient Wisdom of Ayurveda - Complete Beginner\'s Guide',
            seo_description: 'Learn about Ayurveda, the 5,000-year-old Indian healing system. Discover doshas, benefits, and how to start your Ayurvedic journey.',
            tags: ['ayurveda', 'wellness', 'doshas', 'holistic health', 'beginners guide'],
        },
        {
            title: 'Top 10 Ayurvedic Herbs for Immunity',
            slug: 'top-10-ayurvedic-herbs-immunity',
            excerpt: 'Boost your immune system naturally with these powerful Ayurvedic herbs that have been used for centuries to promote health and vitality.',
            content: `<h2>Building Immunity the Natural Way</h2>
<p>In Ayurveda, a strong immune system is the foundation of good health. Here are the top 10 herbs that have been trusted for centuries to boost immunity:</p>

<h2>1. Ashwagandha (Withania somnifera)</h2>
<p>Known as the "Indian Ginseng," Ashwagandha is a powerful adaptogen that helps reduce stress and boost immune function.</p>

<h2>2. Tulsi (Holy Basil)</h2>
<p>Revered as "The Queen of Herbs," Tulsi has potent antibacterial, antiviral, and antifungal properties.</p>

<h2>3. Amla (Indian Gooseberry)</h2>
<p>Rich in Vitamin C, Amla is one of the most powerful immune boosters in Ayurveda.</p>

<h2>4. Turmeric (Haldi)</h2>
<p>Contains curcumin, which has powerful anti-inflammatory and antioxidant properties.</p>

<h2>5. Giloy (Guduchi)</h2>
<p>Known as the "Root of Immortality," Giloy is excellent for boosting immunity and fighting infections.</p>

<h2>6. Neem</h2>
<p>Powerful blood purifier and immunity booster with antibacterial properties.</p>

<h2>7. Moringa</h2>
<p>Nutrient-dense superfood that supports immune function and overall health.</p>

<h2>8. Ginger</h2>
<p>Improves digestion and has warming properties that boost immunity.</p>

<h2>9. Black Pepper</h2>
<p>Enhances bioavailability of other herbs and supports respiratory health.</p>

<h2>10. Chyawanprash</h2>
<p>A traditional herbal jam with 40+ ingredients that boosts immunity and vitality.</p>`,
            featured_image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800',
            author_id: adminUser.id,
            category: 'Herbs',
            status: 'PUBLISHED',
            published_at: new Date('2026-01-20'),
            seo_title: 'Top 10 Ayurvedic Herbs for Immunity Boosting',
            seo_description: 'Discover the best Ayurvedic herbs to boost your immune system naturally. Learn about Ashwagandha, Tulsi, Amla, and more.',
            tags: ['immunity', 'herbs', 'ashwagandha', 'tulsi', 'turmeric', 'natural remedies'],
        },
        {
            title: 'Understanding Your Dosha: Vata, Pitta, and Kapha',
            slug: 'understanding-your-dosha-vata-pitta-kapha',
            excerpt: 'Take our simple guide to discover your dominant dosha and learn how to balance it for optimal health and well-being.',
            content: `<h2>What Are Doshas?</h2>
<p>Doshas are the three fundamental energies that govern our physical and mental processes. Understanding your dominant dosha can help you make better lifestyle choices.</p>

<h2>Vata Dosha (Air + Space)</h2>
<p><strong>Characteristics:</strong> Creative, energetic, enthusiastic</p>
<p><strong>Physical traits:</strong> Thin build, dry skin, cold hands and feet</p>
<p><strong>When balanced:</strong> Creative, flexible, enthusiastic</p>
<p><strong>When imbalanced:</strong> Anxious, insomnia, dry skin, constipation</p>

<h2>Pitta Dosha (Fire + Water)</h2>
<p><strong>Characteristics:</strong> Intelligent, ambitious, leadership qualities</p>
<p><strong>Physical traits:</strong> Medium build, warm body temperature, strong digestion</p>
<p><strong>When balanced:</strong> Sharp intellect, good concentration, strong digestion</p>
<p><strong>When imbalanced:</strong> Anger, inflammation, heartburn, skin rashes</p>

<h2>Kapha Dosha (Earth + Water)</h2>
<p><strong>Characteristics:</strong> Calm, loving, forgiving, stable</p>
<p><strong>Physical traits:</strong> Larger build, smooth skin, strong immunity</p>
<p><strong>When balanced:</strong> Calm, loving, supportive, strong immunity</p>
<p><strong>When imbalanced:</strong> Lethargy, weight gain, congestion, attachment</p>

<h2>Balancing Your Doshas</h2>
<p>Learn specific dietary recommendations, lifestyle practices, and herbal remedies to keep your doshas in balance for optimal health.</p>`,
            featured_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
            author_id: adminUser.id,
            category: 'Education',
            status: 'PUBLISHED',
            published_at: new Date('2026-01-25'),
            seo_title: 'Understanding Doshas: Vata, Pitta, Kapha Explained',
            seo_description: 'Learn about the three doshas in Ayurveda. Discover your dominant dosha and how to balance Vata, Pitta, and Kapha for optimal health.',
            tags: ['doshas', 'vata', 'pitta', 'kapha', 'constitution', 'prakriti'],
        },
    ];

    for (const post of blogPosts) {
        const createdPost = await prisma.blogPost.upsert({
            where: { slug: post.slug },
            update: {},
            create: {
                ...post,
                tags: {
                    create: post.tags.map(tag => ({ tag })),
                },
            },
        });
        console.log(`✅ Created blog post: ${createdPost.title}`);
    }

    console.log(`\n✅ Seeded ${blogPosts.length} blog posts successfully!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
