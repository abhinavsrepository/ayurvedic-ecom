import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';
import { Badge } from './badge';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Product Analytics</CardTitle>
        <CardDescription>View your product performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Products</span>
            <span className="font-semibold">156</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">In Stock</span>
            <span className="font-semibold">142</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Low Stock</span>
            <span className="font-semibold text-orange-600">12</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Out of Stock</span>
            <span className="font-semibold text-red-600">2</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  ),
};

export const KPICard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">₹2.5L</p>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <span>↑ 12.5%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const OrderCard: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">#ORD-2025-0001</h3>
              <Badge variant="success">Processing</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">Rajesh Kumar • rajesh@example.com</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Order Total</p>
                <p className="font-semibold">₹1,830</p>
              </div>
              <div>
                <p className="text-gray-500">Payment</p>
                <p className="font-semibold text-green-600">Paid</p>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-semibold">Jan 17, 2025</p>
              </div>
              <div>
                <p className="text-gray-500">Items</p>
                <p className="font-semibold">2 products</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button variant="outline" size="sm">View</Button>
            <Button variant="outline" size="sm">Invoice</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};
