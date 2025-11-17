'use client';

import { useState } from 'react';
import { Plus, FileText, Image, Edit, Trash2, Eye, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion, Reorder } from 'framer-motion';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  status: 'draft' | 'published';
  publishedAt: string;
  views: number;
}

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: number;
  isActive: boolean;
}

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<'blog' | 'banners'>('blog');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Understanding Your Dosha: A Complete Guide',
      slug: 'understanding-your-dosha',
      excerpt: 'Learn about the three doshas and how they affect your health...',
      author: 'Dr. Priya Sharma',
      status: 'published',
      publishedAt: '2025-01-15',
      views: 1245,
    },
    {
      id: '2',
      title: 'Top 10 Ayurvedic Herbs for Immunity',
      slug: 'ayurvedic-herbs-immunity',
      excerpt: 'Discover powerful herbs that boost your immune system naturally...',
      author: 'Dr. Raj Kumar',
      status: 'published',
      publishedAt: '2025-01-10',
      views: 892,
    },
    {
      id: '3',
      title: 'Ayurvedic Diet Plan for Weight Loss',
      slug: 'ayurvedic-diet-weight-loss',
      excerpt: 'A comprehensive guide to losing weight the Ayurvedic way...',
      author: 'Dr. Priya Sharma',
      status: 'draft',
      publishedAt: '',
      views: 0,
    },
  ]);

  const [banners, setBanners] = useState<Banner[]>([
    {
      id: '1',
      title: 'Summer Sale Banner',
      imageUrl: '/banners/summer-sale.jpg',
      linkUrl: '/shop?sale=summer',
      position: 1,
      isActive: true,
    },
    {
      id: '2',
      title: 'New Arrivals',
      imageUrl: '/banners/new-arrivals.jpg',
      linkUrl: '/shop?filter=new',
      position: 2,
      isActive: true,
    },
    {
      id: '3',
      title: 'Ayurvedic Consultation',
      imageUrl: '/banners/consultation.jpg',
      linkUrl: '/consultation',
      position: 3,
      isActive: false,
    },
  ]);

  const [showBlogDialog, setShowBlogDialog] = useState(false);
  const [showBannerDialog, setShowBannerDialog] = useState(false);

  const handleReorderBanners = (newOrder: Banner[]) => {
    const reorderedBanners = newOrder.map((banner, index) => ({
      ...banner,
      position: index + 1,
    }));
    setBanners(reorderedBanners);
    toast.success('Banner order updated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage blog posts, banners, and other content
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('blog')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'blog'
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="w-5 h-5 inline mr-2" />
            Blog Posts
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'banners'
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Image className="w-5 h-5 inline mr-2" />
            Banners
          </button>
        </nav>
      </div>

      {/* Blog Posts Tab */}
      {activeTab === 'blog' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Badge variant="success">{blogPosts.filter(p => p.status === 'published').length} Published</Badge>
              <Badge variant="secondary">{blogPosts.filter(p => p.status === 'draft').length} Drafts</Badge>
            </div>
            <Button onClick={() => setShowBlogDialog(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              New Blog Post
            </Button>
          </div>

          <div className="grid gap-4">
            {blogPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{post.title}</h3>
                          {post.status === 'published' ? (
                            <Badge variant="success">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>By {post.author}</span>
                          {post.publishedAt && (
                            <span>{new Date(post.publishedAt).toLocaleDateString('en-IN')}</span>
                          )}
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {post.views.toLocaleString()} views
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Banners Tab */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Drag and drop to reorder banners
            </p>
            <Button onClick={() => setShowBannerDialog(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </div>

          <Reorder.Group axis="y" values={banners} onReorder={handleReorderBanners} className="space-y-4">
            {banners.map((banner) => (
              <Reorder.Item
                key={banner.id}
                value={banner}
                className="cursor-move"
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                      <div className="w-32 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{banner.title}</h3>
                          {banner.isActive ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{banner.linkUrl}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}

      {/* Create Blog Dialog */}
      <Dialog open={showBlogDialog} onOpenChange={setShowBlogDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>
              Write a new blog post for your Ayurveda knowledge base
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Enter blog post title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" placeholder="understanding-your-dosha" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <textarea
                id="excerpt"
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Short description of the blog post..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown/WYSIWYG)</Label>
              <textarea
                id="content"
                rows={10}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                placeholder="Write your blog content here (Markdown supported)..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlogDialog(false)}>
              Save as Draft
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Banner Dialog */}
      <Dialog open={showBannerDialog} onOpenChange={setShowBannerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Banner</DialogTitle>
            <DialogDescription>
              Upload a banner image and set its link destination
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bannerTitle">Banner Title</Label>
              <Input id="bannerTitle" placeholder="Summer Sale" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bannerImage">Banner Image</Label>
              <Input id="bannerImage" type="file" accept="image/*" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkUrl">Link URL</Label>
              <Input id="linkUrl" placeholder="/shop?sale=summer" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBannerDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Add Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
