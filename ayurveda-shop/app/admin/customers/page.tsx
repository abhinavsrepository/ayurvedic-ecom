'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, Download, Eye, Mail, Phone, ShoppingBag, TrendingUp, UserPlus } from 'lucide-react';
import { customersApi } from '@/lib/api/customers';
import { Customer } from '@/lib/api/types';
import { toast } from 'sonner';
import { Spinner, PageLoader, TableSkeleton, CardSkeleton } from '@/components/shared/Spinner';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchCustomers();
  }, [pagination.page, pagination.size]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customersApi.getAll({
        page: pagination.page,
        size: pagination.size,
      });
      
      const transformedCustomers = response.content.map((c) => ({
        ...c,
        name: `${c.firstName} ${c.lastName}`.trim() || c.email,
        phone: c.phoneNumber || 'N/A',
        status: c.totalOrders > 0 ? 'active' : 'inactive' as 'active' | 'inactive',
        lastOrderDate: c.lastOrderAt || undefined,
      }));
      
      setCustomers(transformedCustomers);
      setPagination((prev) => ({
        ...prev,
        total: response.totalElements,
        totalPages: response.totalPages,
      }));
    } catch (error: any) {
      console.error('Failed to fetch customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchCustomers();
      return;
    }

    try {
      setLoading(true);
      const response = await customersApi.search(searchQuery, {
        page: 0,
        size: pagination.size,
      });
      
      const transformedCustomers = response.content.map((c) => ({
        ...c,
        name: `${c.firstName} ${c.lastName}`.trim() || c.email,
        phone: c.phoneNumber || 'N/A',
        status: c.totalOrders > 0 ? 'active' : 'inactive' as 'active' | 'inactive',
        lastOrderDate: c.lastOrderAt || undefined,
      }));
      
      setCustomers(transformedCustomers);
      setPagination((prev) => ({
        ...prev,
        total: response.totalElements,
        totalPages: response.totalPages,
        page: 0,
      }));
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await customersApi.exportCustomers();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `customers-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Customers exported successfully');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const getStats = () => {
    const totalCustomers = pagination.total;
    const activeCustomers = customers.filter((c) => c.status === 'active').length;
    const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const avgLtv = totalCustomers > 0 
      ? customers.reduce((sum, c) => sum + (c.lifetimeValue || 0), 0) / totalCustomers 
      : 0;

    return [
      { label: 'Total Customers', value: totalCustomers.toLocaleString(), icon: Users },
      { label: 'Active This Month', value: activeCustomers.toLocaleString(), icon: UserPlus },
      { label: 'Total Revenue', value: `Rs.${Math.floor(totalRevenue).toLocaleString()}`, icon: TrendingUp },
      { label: 'Avg Lifetime Value', value: `Rs.${Math.floor(avgLtv).toLocaleString()}`, icon: ShoppingBag },
    ];
  };

  if (loading && customers.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              View and manage customer information
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and manage customer information
          </p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {getStats().map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <stat.icon className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Spinner size="sm" />}
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                fetchCustomers();
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading && customers.length === 0 ? (
          <TableSkeleton rows={5} />
        ) : customers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No customers found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Lifetime Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              {customer.firstName?.[0]}{customer.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {customer.name}
                            </p>
                            <p className="text-sm text-gray-500">Customer since {new Date(customer.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4 mr-2" />
                            {customer.email}
                          </div>
                          {customer.phoneNumber && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Phone className="w-4 h-4 mr-2" />
                              {customer.phoneNumber}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">{customer.totalOrders}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">Rs.{customer.totalSpent?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-green-600">Rs.{customer.lifetimeValue?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          customer.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => router.push(`/admin/customers/${customer.id}`)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {customers.length} of {pagination.total} customers
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                    disabled={pagination.page === 0 || loading}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {pagination.page + 1} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                    disabled={pagination.page >= pagination.totalPages - 1 || loading}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
