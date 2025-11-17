'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Download, AlertTriangle, TrendingDown, Package } from 'lucide-react';
import type { Product } from '@/types/product';
import { toast } from 'sonner';

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [stockValues, setStockValues] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();

      if (data.success && data.products) {
        // Transform products to include inventory fields
        const productsWithInventory = data.products.map((p: any) => ({
          ...p,
          stock: p.stock || 0,
          lowStockThreshold: p.lowStockThreshold || 20,
          sku: p.sku || p.id,
          mrp: p.mrp || p.price,
          status: p.status || 'active',
          variants: p.variants || [],
          images: p.images || [],
          ingredients: p.ingredients || [],
          benefits: p.benefits || [],
          createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
          updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        }));
        setProducts(productsWithInventory);
      } else {
        setProducts([]);
      }
    } catch (error: any) {
      console.error('Failed to fetch products:', error);

      // Handle 401 errors differently (authentication issues)
      if (error.response?.status === 401) {
        // Don't show error toast - the API client will handle redirect to login
        setProducts([]);
      } else {
        toast.error('Failed to load inventory', {
          description: 'Please check if the backend is running'
        });
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (showLowStockOnly) {
      filtered = filtered.filter(p => p.stock <= p.lowStockThreshold);
    }

    return filtered.sort((a, b) => {
      const aLow = a.stock <= a.lowStockThreshold;
      const bLow = b.stock <= b.lowStockThreshold;
      if (aLow && !bLow) return -1;
      if (!aLow && bLow) return 1;
      return 0;
    });
  }, [products, searchQuery, showLowStockOnly]);

  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  const handleStockEdit = (productId: string, currentStock: number) => {
    setEditingStock(productId);
    setStockValues({ ...stockValues, [productId]: currentStock });
  };

  const handleStockSave = async (productId: string) => {
    const newStock = stockValues[productId];
    if (newStock === undefined || newStock < 0) {
      toast.error('Invalid stock value');
      return;
    }

    try {
      // Update product via API
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const response = await fetch(`/api/products/${product.slug || product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          stock: newStock,
          updatedAt: new Date(),
        }),
      });

      if (response.ok) {
        const updatedProducts = products.map(p =>
          p.id === productId ? { ...p, stock: newStock, updatedAt: new Date() } : p
        );
        setProducts(updatedProducts);
        setEditingStock(null);
        toast.success('Stock updated successfully');
      } else {
        toast.error('Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock', {
        description: 'Please check if the backend is running'
      });
    }
  };

  const handleExportCSV = () => {
    const headers = ['SKU', 'Product Name', 'Category', 'Current Stock', 'Low Stock Threshold', 'Price', 'Stock Value', 'Status'];
    const rows = filteredProducts.map(p => [
      p.sku,
      p.name,
      p.category,
      p.stock,
      p.lowStockThreshold,
      p.price,
      p.price * p.stock,
      p.stock === 0 ? 'Out of Stock' : p.stock <= p.lowStockThreshold ? 'Low Stock' : 'In Stock',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Monitor and manage product stock levels
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total SKUs</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {products.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock Items</p>
          <p className="mt-2 text-2xl font-bold text-orange-600">
            {lowStockCount}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Out of Stock</p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {outOfStockCount}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Inventory Value</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            ₹{totalValue.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Alerts */}
      {lowStockCount > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 flex items-start">
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300">
              Low Stock Alert
            </h3>
            <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
              {lowStockCount} product{lowStockCount > 1 ? 's are' : ' is'} running low on stock. Review and restock as needed.
            </p>
          </div>
        </div>
      )}

      {outOfStockCount > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
          <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
              Out of Stock Alert
            </h3>
            <p className="text-sm text-red-700 dark:text-red-400 mt-1">
              {outOfStockCount} product{outOfStockCount > 1 ? 's are' : ' is'} completely out of stock. Restock immediately!
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Show low stock only</span>
          </label>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Threshold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium">No products found</p>
                      <p className="text-sm mt-2">
                        {products.length === 0
                          ? 'No products in the inventory yet. Products will appear here once they are added to the backend.'
                          : 'Try adjusting your search criteria.'
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isLowStock = product.stock <= product.lowStockThreshold;
                  const isOutOfStock = product.stock === 0;
                  const isEditing = editingStock === product.id;

                  return (
                    <tr key={product.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      isOutOfStock ? 'bg-red-50 dark:bg-red-900/10' : isLowStock ? 'bg-orange-50 dark:bg-orange-900/10' : ''
                    }`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={stockValues[product.id] ?? product.stock}
                          onChange={(e) => setStockValues({ ...stockValues, [product.id]: parseInt(e.target.value) || 0 })}
                          className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          autoFocus
                        />
                      ) : (
                        <span className={`text-sm font-medium ${
                          isOutOfStock ? 'text-red-600 dark:text-red-400' :
                          isLowStock ? 'text-orange-600 dark:text-orange-400' :
                          'text-gray-900 dark:text-white'
                        }`}>
                          {product.stock}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {product.lowStockThreshold}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ₹{product.price.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ₹{(product.price * product.stock).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        isOutOfStock
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          : isLowStock
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {isEditing ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStockSave(product.id)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingStock(null)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStockEdit(product.id, product.stock)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Edit Stock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
