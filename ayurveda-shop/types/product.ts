export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
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
