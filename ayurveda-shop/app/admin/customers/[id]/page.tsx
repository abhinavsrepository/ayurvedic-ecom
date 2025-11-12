'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, TrendingUp, Tag } from 'lucide-react';
import { getMockCustomers } from '@/lib/mocks/customers';
import { getMockOrders } from '@/lib/mocks/orders';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const customer = useMemo(() => {
    const customers = getMockCustomers();
    return customers.find(c => c.id === customerId);
  }, [customerId]);

  const customerOrders = useMemo(() => {
    if (!customer) return [];
    const orders = getMockOrders();
    return orders.filter(o => o.customerId === customer.id);
  }, [customer]);

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Customer not found</p>
        <button
          onClick={() => router.push('/admin/customers')}
          className="mt-4 text-green-600 hover:text-green-700"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  const segmentColors = {
    vip: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    regular: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    new: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    churned: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push('/admin/customers')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {customer.name}
          </h1>
          <div className="flex items-center mt-2 space-x-2">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${segmentColors[customer.segment]}`}>
              {customer.segment}
            </span>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
              customer.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {customer.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm text-gray-900 dark:text-white">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-sm text-gray-900 dark:text-white">{customer.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Customer Stats
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Lifetime Value</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{customer.ltv.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingBag className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Orders</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {customer.totalOrders}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Order Value</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{Math.floor(customer.avgOrderValue).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Saved Addresses
            </h2>
            <div className="space-y-4">
              {customer.addresses.map((address) => (
                <div key={address.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {address.type}
                    </span>
                    {address.isDefault && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{address.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{address.phone}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {customer.tags.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {customer.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order History ({customerOrders.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {customerOrders.length > 0 ? (
                    customerOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => router.push(`/admin/orders/${order.id}`)}
                            className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400"
                          >
                            {order.orderNumber}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                              : order.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                          ₹{order.total.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                        No orders found for this customer
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Customer Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 bg-green-500 rounded-full mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Last Order
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(customer.lastOrderDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    First Order
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(customer.firstOrderDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 bg-purple-500 rounded-full mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Customer Since
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(customer.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
