// Mock Ayurvedic products data
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  mrp: number;
  stock: number;
  lowStockThreshold: number;
  status: 'active' | 'inactive' | 'draft';
  variants: ProductVariant[];
  images: string[];
  description: string;
  ingredients: string[];
  benefits: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

const ayurvedicProducts = [
  'Ashwagandha Capsules',
  'Triphala Churna',
  'Brahmi Oil',
  'Chyawanprash',
  'Amla Juice',
  'Tulsi Drops',
  'Neem Capsules',
  'Giloy Tablets',
  'Shatavari Powder',
  'Arjuna Capsules',
  'Haritaki Powder',
  'Kumkumadi Oil',
  'Bhringraj Hair Oil',
  'Moringa Powder',
  'Turmeric Capsules',
  'Gokshura Tablets',
  'Ashoka Syrup',
  'Punarnava Tablets',
  'Shankhpushpi Syrup',
  'Manjistha Powder',
];

const categories = [
  'Immunity Boosters',
  'Hair Care',
  'Skin Care',
  'Digestive Health',
  'Joint Care',
  'Heart Health',
  'Brain Health',
  'Women Health',
  'Men Health',
  'General Wellness',
];

export function generateMockProducts(count: number = 50): Product[] {
  const products: Product[] = [];

  for (let i = 0; i < count; i++) {
    const name = ayurvedicProducts[i % ayurvedicProducts.length];
    const price = Math.floor(Math.random() * 1500) + 200;
    const mrp = price + Math.floor(price * 0.2);
    const stock = Math.floor(Math.random() * 500);

    products.push({
      id: `PROD-${String(i + 1).padStart(4, '0')}`,
      name: `${name} ${i > ayurvedicProducts.length ? `- Variant ${i}` : ''}`,
      sku: `AYU-${String(i + 1000).padStart(5, '0')}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      price,
      mrp,
      stock,
      lowStockThreshold: 20,
      status: Math.random() > 0.1 ? 'active' : Math.random() > 0.5 ? 'inactive' : 'draft',
      variants: generateVariants(i),
      images: [
        `/api/placeholder/400/400?text=${encodeURIComponent(name)}`,
        `/api/placeholder/400/400?text=${encodeURIComponent(name)}-2`,
      ],
      description: `Premium quality ${name} sourced from authentic Ayurvedic manufacturers. 100% natural and organic.`,
      ingredients: ['Organic herbs', 'Natural extracts', 'Traditional formulation'],
      benefits: ['Boosts immunity', 'Improves vitality', 'Natural wellness'],
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    });
  }

  return products;
}

function generateVariants(productIndex: number): ProductVariant[] {
  const sizes = ['30 Capsules', '60 Capsules', '90 Capsules'];
  const variants: ProductVariant[] = [];

  for (let i = 0; i < Math.min(3, Math.floor(Math.random() * 4)); i++) {
    variants.push({
      id: `VAR-${productIndex}-${i}`,
      name: sizes[i],
      sku: `AYU-${String(productIndex + 1000).padStart(5, '0')}-${i + 1}`,
      price: 200 + i * 150,
      stock: Math.floor(Math.random() * 200),
      attributes: {
        size: sizes[i],
        quantity: String((i + 1) * 30),
      },
    });
  }

  return variants;
}

// TODO: replace with Spring-Boot call /api/products
export function getMockProducts(): Product[] {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('ayurveda_products');
    if (cached) {
      return JSON.parse(cached, (key, value) => {
        if (key === 'createdAt' || key === 'updatedAt') return new Date(value);
        return value;
      });
    }
  }

  const products = generateMockProducts(50);
  if (typeof window !== 'undefined') {
    localStorage.setItem('ayurveda_products', JSON.stringify(products));
  }
  return products;
}

export function saveMockProducts(products: Product[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ayurveda_products', JSON.stringify(products));
  }
}
