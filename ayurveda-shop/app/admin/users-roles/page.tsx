'use client';

import { useState } from 'react';
import { Plus, Search, Shield, User, Clock, Edit, Trash2, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  details: string;
}

export default function UsersRolesPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'audit'>('users');
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [users] = useState<AdminUser[]>([
    {
      id: '1',
      fullName: 'Amit Sharma',
      email: 'amit@ayurveda.com',
      roles: ['ADMIN'],
      isActive: true,
      lastLogin: '2025-01-17T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      fullName: 'Priya Patel',
      email: 'priya@ayurveda.com',
      roles: ['OPS', 'FINANCE'],
      isActive: true,
      lastLogin: '2025-01-16T15:45:00Z',
      createdAt: '2024-03-15T00:00:00Z',
    },
    {
      id: '3',
      fullName: 'Raj Kumar',
      email: 'raj@ayurveda.com',
      roles: ['OPS'],
      isActive: false,
      lastLogin: '2025-01-10T09:20:00Z',
      createdAt: '2024-06-01T00:00:00Z',
    },
  ]);

  const [roles] = useState<Role[]>([
    {
      id: '1',
      name: 'ADMIN',
      description: 'Full system access with all permissions',
      permissions: ['all'],
      userCount: 1,
    },
    {
      id: '2',
      name: 'OPS',
      description: 'Operations team - manage products, orders, inventory',
      permissions: ['products.read', 'products.write', 'orders.read', 'orders.write', 'inventory.manage'],
      userCount: 2,
    },
    {
      id: '3',
      name: 'FINANCE',
      description: 'Finance team - view analytics and financial reports',
      permissions: ['analytics.read', 'reports.read', 'orders.read'],
      userCount: 1,
    },
    {
      id: '4',
      name: 'SUPPORT',
      description: 'Customer support - handle customer inquiries and basic order updates',
      permissions: ['customers.read', 'orders.read', 'orders.update_status'],
      userCount: 0,
    },
  ]);

  const [auditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      user: 'amit@ayurveda.com',
      action: 'UPDATE',
      resource: 'Product #1234',
      timestamp: '2025-01-17T10:45:00Z',
      ipAddress: '192.168.1.100',
      details: 'Updated product price from ₹999 to ₹899',
    },
    {
      id: '2',
      user: 'priya@ayurveda.com',
      action: 'CREATE',
      resource: 'Order #ORD-5678',
      timestamp: '2025-01-17T09:30:00Z',
      ipAddress: '192.168.1.101',
      details: 'Created manual order for customer',
    },
    {
      id: '3',
      user: 'amit@ayurveda.com',
      action: 'DELETE',
      resource: 'Promotion WINTER2024',
      timestamp: '2025-01-16T16:20:00Z',
      ipAddress: '192.168.1.100',
      details: 'Deleted expired promotion',
    },
    {
      id: '4',
      user: 'priya@ayurveda.com',
      action: 'UPDATE',
      resource: 'User Settings',
      timestamp: '2025-01-16T14:15:00Z',
      ipAddress: '192.168.1.101',
      details: 'Changed notification preferences',
    },
  ]);

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users & Roles</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage admin users, roles, and permissions
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'users', label: 'Users', icon: User },
            { key: 'roles', label: 'Roles & Permissions', icon: Shield },
            { key: 'audit', label: 'Audit Logs', icon: Clock },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setShowUserDialog(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {user.roles.map((role) => (
                          <Badge key={role} variant="secondary">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(user.lastLogin).toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowRoleDialog(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role, idx) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-5 h-5 text-green-600" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{role.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
                      </div>
                      <Badge>{role.userCount} users</Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Permissions</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            <Key className="w-3 h-3 mr-1" />
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" disabled={role.userCount > 0}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell>
                      <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                    </TableCell>
                    <TableCell>{log.resource}</TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">{log.ipAddress}</TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* Create User Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin User</DialogTitle>
            <DialogDescription>
              Create a new admin user and assign roles
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@ayurveda.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Initial Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>Assign Roles</Label>
              <div className="space-y-2">
                {roles.map((role) => (
                  <label key={role.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{role.name}</span>
                    <span className="text-xs text-gray-500">- {role.description}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define a new role with specific permissions
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name</Label>
              <Input id="roleName" placeholder="MARKETING" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleDescription">Description</Label>
              <Input id="roleDescription" placeholder="Marketing team - manage content and promotions" />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-md p-4">
                {[
                  'products.read',
                  'products.write',
                  'orders.read',
                  'orders.write',
                  'customers.read',
                  'customers.write',
                  'promotions.read',
                  'promotions.write',
                  'content.read',
                  'content.write',
                  'analytics.read',
                  'settings.read',
                  'settings.write',
                  'users.manage',
                ].map((permission) => (
                  <label key={permission} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{permission}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
