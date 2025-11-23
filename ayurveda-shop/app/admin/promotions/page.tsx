'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Download, Trash2, Edit, Calendar, Tag, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Promotion {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'bogo' | 'free_shipping';
  value: number;
  description: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  minPurchase: number;
  isActive: boolean;
  applicableProducts?: string[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Promotion>>({
    type: 'percentage',
    isActive: true,
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      // API call would go here
      // Simulated data for now
      const mockData: Promotion[] = [
        {
          id: '1',
          code: 'SUMMER2025',
          type: 'percentage',
          value: 20,
          description: 'Summer Sale - 20% off all products',
          startDate: '2025-06-01',
          endDate: '2025-08-31',
          usageLimit: 1000,
          usageCount: 245,
          minPurchase: 999,
          isActive: true,
        },
        {
          id: '2',
          code: 'FREESHIP',
          type: 'free_shipping',
          value: 0,
          description: 'Free shipping on orders above ₹1999',
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          usageLimit: 0,
          usageCount: 1582,
          minPurchase: 1999,
          isActive: true,
        },
        {
          id: '3',
          code: 'BOGO50',
          type: 'bogo',
          value: 50,
          description: 'Buy one get one 50% off on selected items',
          startDate: '2025-03-01',
          endDate: '2025-03-31',
          usageLimit: 500,
          usageCount: 123,
          minPurchase: 0,
          isActive: false,
        },
      ];
      setPromotions(mockData);
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
      toast.error('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromotion = async () => {
    try {
      // API call would go here
      toast.success('Promotion created successfully');
      setShowCreateDialog(false);
      setFormData({ type: 'percentage', isActive: true });
      fetchPromotions();
    } catch (error) {
      toast.error('Failed to create promotion');
    }
  };

  const handleDeletePromotion = async (id: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      try {
        // API call would go here
        toast.success('Promotion deleted');
        fetchPromotions();
      } catch (error) {
        toast.error('Failed to delete promotion');
      }
    }
  };

  const filteredPromotions = promotions.filter(promo =>
    promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-4 h-4" />;
      case 'bogo':
        return <Tag className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      percentage: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      fixed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      bogo: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      free_shipping: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    };
    return colors[type] || colors.percentage;
  };

  const getValueDisplay = (promo: Promotion) => {
    switch (promo.type) {
      case 'percentage':
        return `${promo.value}% OFF`;
      case 'fixed':
        return `₹${promo.value} OFF`;
      case 'bogo':
        return `BOGO ${promo.value}%`;
      case 'free_shipping':
        return 'FREE SHIPPING';
      default:
        return promo.value;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Promotions & Coupons</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage discount codes, BOGO deals, and special offers
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchPromotions}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Promotion
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {[
          { title: 'Active Promotions', value: promotions.filter(p => p.isActive).length, icon: Tag, color: 'green' },
          { title: 'Total Usage', value: promotions.reduce((sum, p) => sum + p.usageCount, 0), icon: Percent, color: 'blue' },
          { title: 'Avg. Discount', value: `${Math.round(promotions.reduce((sum, p) => sum + (p.type === 'percentage' ? p.value : 0), 0) / promotions.length)}%`, icon: Percent, color: 'purple' },
          { title: 'This Month', value: '₹2.5L', icon: Calendar, color: 'orange' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={item}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search promotions by code or description..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Promotions List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading promotions...</p>
          </div>
        ) : filteredPromotions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Tag className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No promotions found</p>
            </CardContent>
          </Card>
        ) : (
          filteredPromotions.map((promo, idx) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${getTypeBadge(promo.type)}`}>
                          {getTypeIcon(promo.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{promo.code}</h3>
                            {promo.isActive ? (
                              <Badge variant="success">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{promo.description}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Discount</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{getValueDisplay(promo)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Usage</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {promo.usageCount}/{promo.usageLimit || '∞'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Min Purchase</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">₹{promo.minPurchase}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Start Date</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {new Date(promo.startDate).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">End Date</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {new Date(promo.endDate).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePromotion(promo.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Promotion Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Promotion</DialogTitle>
            <DialogDescription>
              Set up a new discount code or special offer for your customers.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Promo Code</Label>
                <Input
                  id="code"
                  placeholder="SUMMER2025"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="percentage">Percentage Off</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="bogo">BOGO Deal</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Summer sale - get 20% off all products"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  placeholder={formData.type === 'percentage' ? '20' : '100'}
                  value={formData.value || ''}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minPurchase">Min Purchase (₹)</Label>
                <Input
                  id="minPurchase"
                  type="number"
                  placeholder="999"
                  value={formData.minPurchase || ''}
                  onChange={(e) => setFormData({ ...formData, minPurchase: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage Limit (0 for unlimited)</Label>
              <Input
                id="usageLimit"
                type="number"
                placeholder="1000"
                value={formData.usageLimit || ''}
                onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePromotion} className="bg-green-600 hover:bg-green-700">
              Create Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
