/**
 * Blog Service
 *
 * Business logic for blog posts and content management.
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CACHE_KEYS, CACHE_TTL } from '../cache/cache.constants';
import { CreatePostDto, PostStatus } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  /**
   * Get all posts with pagination and filters
   */
  async findAll(query: QueryPostDto, isAdmin: boolean = false) {
    const { page = 0, size = 10, category, tag, status, search } = query;

    const cacheKey = CACHE_KEYS.BLOG_POSTS_LIST(page, size);

    // Only cache public queries
    if (!isAdmin && !status && !search) {
      return this.cacheService.wrap(
        cacheKey,
        () => this.fetchPosts(query, isAdmin),
        CACHE_TTL.MEDIUM,
      );
    }

    return this.fetchPosts(query, isAdmin);
  }

  private async fetchPosts(query: QueryPostDto, isAdmin: boolean) {
    const { page = 0, size = 10, category, tag, status, search } = query;

    const where: any = {};

    // Non-admin only sees published posts
    if (!isAdmin) {
      where.status = PostStatus.PUBLISHED;
    } else if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    if (tag) {
      where.tags = {
        some: { tag: { equals: tag, mode: 'insensitive' } },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip: page * size,
        take: size,
        orderBy: { published_at: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              full_name: true,
              username: true,
            },
          },
          tags: true,
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      content: posts.map((p) => this.formatPost(p, false)),
      pagination: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size),
      },
    };
  }

  /**
   * Get post by slug
   */
  async findBySlug(slug: string) {
    const cacheKey = CACHE_KEYS.BLOG_POST_BY_SLUG(slug);

    return this.cacheService.wrap(
      cacheKey,
      async () => {
        const post = await this.prisma.blogPost.findUnique({
          where: { slug },
          include: {
            author: {
              select: {
                id: true,
                full_name: true,
                username: true,
              },
            },
            tags: true,
          },
        });

        if (!post || post.status !== PostStatus.PUBLISHED) {
          throw new NotFoundException('Post not found');
        }

        // Increment view count (fire and forget)
        this.prisma.blogPost
          .update({
            where: { id: post.id },
            data: { view_count: { increment: 1 } },
          })
          .catch(() => {});

        return this.formatPost(post, true);
      },
      CACHE_TTL.MEDIUM,
    );
  }

  /**
   * Get post by ID (admin)
   */
  async findById(id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            full_name: true,
            username: true,
          },
        },
        tags: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.formatPost(post, true);
  }

  /**
   * Get all categories
   */
  async getCategories() {
    const categories = await this.prisma.blogPost.groupBy({
      by: ['category'],
      where: {
        status: PostStatus.PUBLISHED,
        category: { not: null },
      },
      _count: { id: true },
    });

    return categories
      .filter((c) => c.category)
      .map((c) => ({
        name: c.category,
        count: c._count.id,
      }));
  }

  /**
   * Get all tags
   */
  async getTags() {
    const tags = await this.prisma.blogTag.groupBy({
      by: ['tag'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 50,
    });

    return tags.map((t) => ({
      name: t.tag,
      count: t._count.id,
    }));
  }

  /**
   * Create a new post
   */
  async create(dto: CreatePostDto, authorId: string) {
    // Check slug uniqueness
    const existing = await this.prisma.blogPost.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException(
        `Post with slug '${dto.slug}' already exists`,
      );
    }

    const post = await this.prisma.blogPost.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        excerpt: dto.excerpt,
        content: dto.content,
        featured_image: dto.featuredImage,
        author_id: authorId,
        category: dto.category,
        status: dto.status || PostStatus.DRAFT,
        published_at: dto.status === PostStatus.PUBLISHED ? new Date() : null,
        seo_title: dto.seoTitle,
        seo_description: dto.seoDescription,
        tags: dto.tags?.length
          ? {
              create: dto.tags.map((tag) => ({ tag })),
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            full_name: true,
            username: true,
          },
        },
        tags: true,
      },
    });

    // Invalidate caches
    await this.invalidateBlogCaches();

    this.logger.log(`Blog post created: ${post.id} - ${post.title}`);
    return this.formatPost(post, true);
  }

  /**
   * Update a post
   */
  async update(id: string, dto: UpdatePostDto) {
    const existing = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Post not found');
    }

    // Check slug uniqueness if updating
    if (dto.slug && dto.slug !== existing.slug) {
      const slugExists = await this.prisma.blogPost.findUnique({
        where: { slug: dto.slug },
      });

      if (slugExists) {
        throw new ConflictException(
          `Post with slug '${dto.slug}' already exists`,
        );
      }
    }

    // Handle tags update
    if (dto.tags !== undefined) {
      // Delete existing tags
      await this.prisma.blogTag.deleteMany({
        where: { post_id: id },
      });
    }

    const post = await this.prisma.blogPost.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.slug,
        excerpt: dto.excerpt,
        content: dto.content,
        featured_image: dto.featuredImage,
        category: dto.category,
        status: dto.status,
        published_at:
          dto.status === PostStatus.PUBLISHED && !existing.published_at
            ? new Date()
            : existing.published_at,
        seo_title: dto.seoTitle,
        seo_description: dto.seoDescription,
        updated_at: new Date(),
        tags: dto.tags?.length
          ? {
              create: dto.tags.map((tag) => ({ tag })),
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            full_name: true,
            username: true,
          },
        },
        tags: true,
      },
    });

    // Invalidate caches
    await this.invalidateBlogCaches(existing.slug);

    this.logger.log(`Blog post updated: ${post.id} - ${post.title}`);
    return this.formatPost(post, true);
  }

  /**
   * Delete a post
   */
  async delete(id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.prisma.blogPost.delete({
      where: { id },
    });

    // Invalidate caches
    await this.invalidateBlogCaches(post.slug);

    this.logger.log(`Blog post deleted: ${id}`);
    return { message: 'Post deleted successfully' };
  }

  /**
   * Format post for response
   */
  private formatPost(post: any, includeContent: boolean) {
    const formatted: any = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featuredImage: post.featured_image,
      category: post.category,
      status: post.status,
      viewCount: post.view_count,
      publishedAt: post.published_at,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      author: {
        id: post.author.id,
        name: post.author.full_name || post.author.username,
      },
      tags: post.tags.map((t: any) => t.tag),
      seo: {
        title: post.seo_title,
        description: post.seo_description,
      },
    };

    if (includeContent) {
      formatted.content = post.content;
    }

    return formatted;
  }

  /**
   * Invalidate blog caches
   */
  private async invalidateBlogCaches(slug?: string) {
    const promises: Promise<void>[] = [
      this.cacheService.del(CACHE_KEYS.BLOG_POSTS_LIST(0, 10)),
      this.cacheService.del(CACHE_KEYS.BLOG_POSTS_FEATURED),
    ];

    if (slug) {
      promises.push(this.cacheService.del(CACHE_KEYS.BLOG_POST_BY_SLUG(slug)));
    }

    await Promise.all(promises);
  }
}
