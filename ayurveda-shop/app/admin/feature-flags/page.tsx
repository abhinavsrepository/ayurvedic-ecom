'use client';

import { useState } from 'react';
import { Plus, Flag, Eye, Code, Users, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetAudience: 'all' | 'staff' | 'beta_users' | 'percentage';
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export default function FeatureFlagsPage() {
  const [flags] = useState<FeatureFlag[]>([
    {
      id: '1',
      name: 'New Checkout Flow',
      key: 'new_checkout_flow',
      description: 'Enable the redesigned checkout experience with one-click payments',
      enabled: true,
      rolloutPercentage: 50,
      targetAudience: 'percentage',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-15T10:30:00Z',
      updatedBy: 'amit@ayurveda.com',
    },
    {
      id: '2',
      name: 'AI Product Recommendations',
      key: 'ai_recommendations',
      description: 'Show ML-powered product recommendations on product pages',
      enabled: true,
      rolloutPercentage: 100,
      targetAudience: 'all',
      createdAt: '2025-01-10T00:00:00Z',
      updatedAt: '2025-01-16T14:20:00Z',
      updatedBy: 'priya@ayurveda.com',
    },
    {
      id: '3',
      name: 'Dark Mode',
      key: 'dark_mode_ui',
      description: 'Enable dark mode toggle in user settings',
      enabled: false,
      rolloutPercentage: 0,
      targetAudience: 'beta_users',
      createdAt: '2025-01-12T00:00:00Z',
      updatedAt: '2025-01-12T00:00:00Z',
      updatedBy: 'amit@ayurveda.com',
    },
    {
      id: '4',
      name: 'Voice Search',
      key: 'voice_search',
      description: 'Enable voice-based product search functionality',
      enabled: true,
      rolloutPercentage: 10,
      targetAudience: 'percentage',
      createdAt: '2025-01-14T00:00:00Z',
      updatedAt: '2025-01-17T09:15:00Z',
      updatedBy: 'priya@ayurveda.com',
    },
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | null>(null);

  const toggleFlag = (flagId: string) => {
    toast.success('Feature flag updated');
    // API call to toggle flag
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'all':
        return <Users className="w-4 h-4" />;
      case 'percentage':
        return <Percent className="w-4 h-4" />;
      default:
        return <Flag className="w-4 h-4" />;
    }
  };

  const getAudienceLabel = (flag: FeatureFlag) => {
    if (flag.targetAudience === 'all') return 'All Users';
    if (flag.targetAudience === 'staff') return 'Staff Only';
    if (flag.targetAudience === 'beta_users') return 'Beta Users';
    return `${flag.rolloutPercentage}% Rollout`;
  };

  const showImplementationCode = (flag: FeatureFlag) => {
    setSelectedFlag(flag);
    setShowCodeDialog(true);
  };

  const codeExample = selectedFlag ? `// Frontend Usage
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

function MyComponent() {
  const isEnabled = useFeatureFlag('${selectedFlag.key}');

  if (!isEnabled) {
    return <LegacyComponent />;
  }

  return <NewFeature />;
}

// Backend Usage (NestJS)
import { FeatureFlagService } from './feature-flag.service';

@Injectable()
export class MyService {
  constructor(
    private featureFlagService: FeatureFlagService
  ) {}

  async processOrder(userId: string) {
    const enabled = await this.featureFlagService
      .isEnabled('${selectedFlag.key}', userId);

    if (enabled) {
      // New implementation
    } else {
      // Legacy implementation
    }
  }
}` : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Feature Flags</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Control feature rollouts and A/B testing experiments
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          New Feature Flag
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Flags', value: flags.length, color: 'blue' },
          { label: 'Enabled', value: flags.filter(f => f.enabled).length, color: 'green' },
          { label: 'Full Rollout', value: flags.filter(f => f.rolloutPercentage === 100).length, color: 'purple' },
          { label: 'In Testing', value: flags.filter(f => f.rolloutPercentage < 100 && f.rolloutPercentage > 0).length, color: 'orange' },
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

      {/* Feature Flags List */}
      <div className="grid gap-4">
        {flags.map((flag, idx) => (
          <motion.div
            key={flag.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Flag className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{flag.name}</h3>
                          {flag.enabled ? (
                            <Badge variant="success">Enabled</Badge>
                          ) : (
                            <Badge variant="secondary">Disabled</Badge>
                          )}
                        </div>
                        <code className="text-xs text-gray-500 dark:text-gray-400 font-mono">{flag.key}</code>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{flag.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Target Audience</p>
                        <div className="flex items-center gap-1 mt-1">
                          {getAudienceIcon(flag.targetAudience)}
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {getAudienceLabel(flag)}
                          </p>
                        </div>
                      </div>
                      {flag.targetAudience === 'percentage' && (
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Rollout Progress</p>
                          <div className="mt-1">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-600 transition-all"
                                style={{ width: `${flag.rolloutPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          {new Date(flag.updatedAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Updated By</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          {flag.updatedBy.split('@')[0]}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showImplementationCode(flag)}
                    >
                      <Code className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={flag.enabled ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleFlag(flag.id)}
                      className={flag.enabled ? '' : 'bg-green-600 hover:bg-green-700'}
                    >
                      {flag.enabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Feature Flag Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Feature Flag</DialogTitle>
            <DialogDescription>
              Set up a new feature flag for controlled rollouts
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="flagName">Feature Name</Label>
              <Input
                id="flagName"
                placeholder="New Checkout Flow"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="flagKey">Flag Key (code identifier)</Label>
              <Input
                id="flagKey"
                placeholder="new_checkout_flow"
              />
              <p className="text-xs text-gray-500">Use lowercase with underscores</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="flagDescription">Description</Label>
              <textarea
                id="flagDescription"
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Describe what this feature flag controls..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <select
                id="targetAudience"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Users (100%)</option>
                <option value="percentage">Percentage Rollout</option>
                <option value="staff">Staff Only</option>
                <option value="beta_users">Beta Users</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rolloutPercentage">Rollout Percentage</Label>
              <Input
                id="rolloutPercentage"
                type="number"
                min="0"
                max="100"
                placeholder="50"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Create Flag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Code Example Dialog */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Implementation Code</DialogTitle>
            <DialogDescription>
              Use this code to implement the feature flag in your application
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
              <code>{codeExample}</code>
            </pre>
          </div>

          <DialogFooter>
            <Button onClick={() => {
              navigator.clipboard.writeText(codeExample);
              toast.success('Code copied to clipboard');
            }}>
              Copy Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
