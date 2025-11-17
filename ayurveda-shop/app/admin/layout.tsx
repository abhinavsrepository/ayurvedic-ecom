'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Brain,
  Settings,
  Menu,
  X,
  Bell,
  Moon,
  Sun,
  LogOut,
  Globe,
  Smartphone,
  MapPin,
  Image,
  Tag,
  FileText,
  Shield,
  Zap,
  Flag,
} from 'lucide-react';
import { getSocket } from '@/lib/socket';
import { toast, Toaster } from 'sonner';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['ADMIN', 'OPS', 'FINANCE'] },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, roles: ['ADMIN', 'OPS', 'FINANCE'] },
  { name: 'Products', href: '/admin/products', icon: Package, roles: ['ADMIN', 'OPS'] },
  { name: 'Inventory', href: '/admin/inventory', icon: Package, roles: ['ADMIN', 'OPS'] },
  { name: 'Customers', href: '/admin/customers', icon: Users, roles: ['ADMIN', 'OPS'] },
  { name: 'Promotions', href: '/admin/promotions', icon: Tag, roles: ['ADMIN', 'OPS'] },
  { name: 'Content', href: '/admin/content', icon: FileText, roles: ['ADMIN', 'OPS'] },
  { name: 'Banners', href: '/admin/banners', icon: Image, roles: ['ADMIN', 'OPS'] },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: ['ADMIN', 'FINANCE'] },
  { name: 'Traffic Sources', href: '/admin/traffic-sources', icon: Globe, roles: ['ADMIN', 'FINANCE'] },
  { name: 'Device Analytics', href: '/admin/device-analytics', icon: Smartphone, roles: ['ADMIN', 'FINANCE'] },
  { name: 'Geographic', href: '/admin/geographic', icon: MapPin, roles: ['ADMIN', 'FINANCE'] },
  { name: 'ML & AI', href: '/admin/ml', icon: Brain, roles: ['ADMIN'] },
  { name: 'Users & Roles', href: '/admin/users-roles', icon: Shield, roles: ['ADMIN'] },
  { name: 'Webhooks', href: '/admin/webhooks', icon: Zap, roles: ['ADMIN'] },
  { name: 'Feature Flags', href: '/admin/feature-flags', icon: Flag, roles: ['ADMIN'] },
  { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['ADMIN'] },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  useEffect(() => {
    setMounted(true);
    // Initialize theme
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  useEffect(() => {
    // Setup real-time order notifications
    const socket = getSocket();

    socket.on('order:new', (order: any) => {
      setNotifications(prev => prev + 1);
      toast.success('New Order Received', {
        description: `Order ${order.orderNumber} from ${order.customerName} - ₹${order.total.toLocaleString('en-IN')}`,
        action: {
          label: 'View',
          onClick: () => window.location.href = `/admin/orders/${order.id}`,
        },
      });

      // Play notification sound
      if (typeof Audio !== 'undefined') {
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }
    });

    socket.on('alert:lowstock', (alert: any) => {
      toast.warning('Low Stock Alert', {
        description: `${alert.productName} is running low (${alert.currentStock} units left)`,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'AD';
    const names = user.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.fullName.substring(0, 2).toUpperCase();
  };

  // Filter navigation based on user roles
  const filteredNav = navigation.filter(item => {
    if (!user) return false;
    return item.roles.some(role => user.roles.includes(role));
  });

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" richColors />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Ayurveda Admin</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {filteredNav.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">{getUserInitials()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.fullName || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || 'admin@ayurveda.com'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <ProtectedRoute>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </ProtectedRoute>
    </AdminAuthProvider>
  );
}
