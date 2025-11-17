'use client';

import { useState } from 'react';
import { Plus, Zap, CheckCircle, XCircle, RefreshCw, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Webhook {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret: string;
  lastTriggered: string;
  successCount: number;
  failureCount: number;
}

interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  status: 'success' | 'failed' | 'pending';
  statusCode?: number;
  timestamp: string;
  retryCount: number;
  responseTime: number;
}

const AVAILABLE_EVENTS = [
  'order.created',
  'order.updated',
  'order.fulfilled',
  'order.cancelled',
  'product.created',
  'product.updated',
  'product.deleted',
  'inventory.low_stock',
  'customer.created',
  'payment.success',
  'payment.failed',
];

export default function WebhooksPage() {
  const [webhooks] = useState<Webhook[]>([
    {
      id: '1',
      url: 'https://api.example.com/webhooks/orders',
      events: ['order.created', 'order.updated'],
      isActive: true,
      secret: 'whsec_***************',
      lastTriggered: '2025-01-17T10:30:00Z',
      successCount: 1245,
      failureCount: 3,
    },
    {
      id: '2',
      url: 'https://analytics.example.com/webhook',
      events: ['order.fulfilled', 'payment.success'],
      isActive: true,
      secret: 'whsec_***************',
      lastTriggered: '2025-01-17T09:15:00Z',
      successCount: 892,
      failureCount: 0,
    },
    {
      id: '3',
      url: 'https://inventory.example.com/api/webhooks',
      events: ['inventory.low_stock', 'product.updated'],
      isActive: false,
      secret: 'whsec_***************',
      lastTriggered: '2025-01-15T14:20:00Z',
      successCount: 234,
      failureCount: 12,
    },
  ]);

  const [deliveries] = useState<WebhookDelivery[]>([
    {
      id: '1',
      webhookId: '1',
      event: 'order.created',
      status: 'success',
      statusCode: 200,
      timestamp: '2025-01-17T10:30:00Z',
      retryCount: 0,
      responseTime: 145,
    },
    {
      id: '2',
      webhookId: '2',
      event: 'payment.success',
      status: 'success',
      statusCode: 200,
      timestamp: '2025-01-17T09:15:00Z',
      retryCount: 0,
      responseTime: 98,
    },
    {
      id: '3',
      webhookId: '1',
      event: 'order.updated',
      status: 'failed',
      statusCode: 500,
      timestamp: '2025-01-16T16:45:00Z',
      retryCount: 3,
      responseTime: 2340,
    },
    {
      id: '4',
      webhookId: '3',
      event: 'inventory.low_stock',
      status: 'failed',
      statusCode: 404,
      timestamp: '2025-01-15T14:20:00Z',
      retryCount: 2,
      responseTime: 1230,
    },
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const toggleEvent = (event: string) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter(e => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const handleRetryDelivery = (deliveryId: string) => {
    toast.info('Retrying webhook delivery...');
    // API call to retry
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Webhooks</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Configure webhooks to receive real-time events
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Webhook
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Webhooks', value: webhooks.length, color: 'blue' },
          { label: 'Active', value: webhooks.filter(w => w.isActive).length, color: 'green' },
          { label: 'Total Deliveries', value: webhooks.reduce((sum, w) => sum + w.successCount + w.failureCount, 0), color: 'purple' },
          { label: 'Success Rate', value: '98.5%', color: 'orange' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Configured Webhooks */}
      <Card>
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Configured Webhooks</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>URL</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Success/Failed</TableHead>
              <TableHead>Last Triggered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooks.map((webhook) => (
              <TableRow key={webhook.id}>
                <TableCell className="font-medium max-w-xs truncate">{webhook.url}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {webhook.events.slice(0, 2).map((event) => (
                      <Badge key={event} variant="secondary" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                    {webhook.events.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{webhook.events.length - 2} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {webhook.isActive ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      {webhook.successCount}
                    </span>
                    <span className="flex items-center gap-1 text-red-600">
                      <XCircle className="w-4 h-4" />
                      {webhook.failureCount}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date(webhook.lastTriggered).toLocaleString('en-IN')}
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

      {/* Recent Deliveries */}
      <Card>
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Deliveries</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Status Code</TableHead>
              <TableHead>Response Time</TableHead>
              <TableHead>Retries</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveries.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell className="font-medium">{delivery.event}</TableCell>
                <TableCell>
                  {delivery.status === 'success' ? (
                    <Badge variant="success">Success</Badge>
                  ) : delivery.status === 'failed' ? (
                    <Badge variant="destructive">Failed</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className={delivery.statusCode && delivery.statusCode >= 200 && delivery.statusCode < 300 ? 'text-green-600' : 'text-red-600'}>
                    {delivery.statusCode || '-'}
                  </span>
                </TableCell>
                <TableCell>{delivery.responseTime}ms</TableCell>
                <TableCell>{delivery.retryCount}</TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date(delivery.timestamp).toLocaleString('en-IN')}
                </TableCell>
                <TableCell>
                  {delivery.status === 'failed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRetryDelivery(delivery.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Retry
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Create Webhook Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Webhook</DialogTitle>
            <DialogDescription>
              Configure a webhook endpoint to receive real-time events
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                placeholder="https://api.example.com/webhooks"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label>Events to Subscribe</Label>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-md p-4">
                {AVAILABLE_EVENTS.map((event) => (
                  <label key={event} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event)}
                      onChange={() => toggleEvent(event)}
                      className="rounded"
                    />
                    <span className="text-sm">{event}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500">{selectedEvents.length} events selected</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhookSecret">Webhook Secret (optional)</Label>
              <Input
                id="webhookSecret"
                placeholder="whsec_your_secret_here"
                type="password"
              />
              <p className="text-xs text-gray-500">Used to verify webhook signatures</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Create Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
