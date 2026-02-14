"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BlogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_service_1 = require("../cache/cache.service");
const cache_constants_1 = require("../cache/cache.constants");
const create_post_dto_1 = require("./dto/create-post.dto");
let BlogService = BlogService_1 = class BlogService {
    prisma;
    cacheService;
    logger = new common_1.Logger(BlogService_1.name);
    constructor(prisma, cacheService) {
        this.prisma = prisma;
        this.cacheService = cacheService;
    }
    async findAll(query, isAdmin = false) {
        const { page = 0, size = 10, category, tag, status, search } = query;
        const cacheKey = cache_constants_1.CACHE_KEYS.BLOG_POSTS_LIST(page, size);
        if (!isAdmin && !status && !search) {
            return this.cacheService.wrap(cacheKey, () => this.fetchPosts(query, isAdmin), cache_constants_1.CACHE_TTL.MEDIUM);
        }
        return this.fetchPosts(query, isAdmin);
    }
    async fetchPosts(query, isAdmin) {
        const { page = 0, size = 10, category, tag, status, search } = query;
        const where = {};
        if (!isAdmin) {
            where.status = create_post_dto_1.PostStatus.PUBLISHED;
        }
        else if (status) {
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
    async findBySlug(slug) {
        const cacheKey = cache_constants_1.CACHE_KEYS.BLOG_POST_BY_SLUG(slug);
        return this.cacheService.wrap(cacheKey, async () => {
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
            if (!post || post.status !== create_post_dto_1.PostStatus.PUBLISHED) {
                throw new common_1.NotFoundException('Post not found');
            }
            this.prisma.blogPost
                .update({
                where: { id: post.id },
                data: { view_count: { increment: 1 } },
            })
                .catch(() => { });
            return this.formatPost(post, true);
        }, cache_constants_1.CACHE_TTL.MEDIUM);
    }
    async findById(id) {
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
            throw new common_1.NotFoundException('Post not found');
        }
        return this.formatPost(post, true);
    }
    async getCategories() {
        const categories = await this.prisma.blogPost.groupBy({
            by: ['category'],
            where: {
                status: create_post_dto_1.PostStatus.PUBLISHED,
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
    async create(dto, authorId) {
        const existing = await this.prisma.blogPost.findUnique({
            where: { slug: dto.slug },
        });
        if (existing) {
            throw new common_1.ConflictException(`Post with slug '${dto.slug}' already exists`);
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
                status: dto.status || create_post_dto_1.PostStatus.DRAFT,
                published_at: dto.status === create_post_dto_1.PostStatus.PUBLISHED ? new Date() : null,
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
        await this.invalidateBlogCaches();
        this.logger.log(`Blog post created: ${post.id} - ${post.title}`);
        return this.formatPost(post, true);
    }
    async update(id, dto) {
        const existing = await this.prisma.blogPost.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (dto.slug && dto.slug !== existing.slug) {
            const slugExists = await this.prisma.blogPost.findUnique({
                where: { slug: dto.slug },
            });
            if (slugExists) {
                throw new common_1.ConflictException(`Post with slug '${dto.slug}' already exists`);
            }
        }
        if (dto.tags !== undefined) {
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
                published_at: dto.status === create_post_dto_1.PostStatus.PUBLISHED && !existing.published_at
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
        await this.invalidateBlogCaches(existing.slug);
        this.logger.log(`Blog post updated: ${post.id} - ${post.title}`);
        return this.formatPost(post, true);
    }
    async delete(id) {
        const post = await this.prisma.blogPost.findUnique({
            where: { id },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        await this.prisma.blogPost.delete({
            where: { id },
        });
        await this.invalidateBlogCaches(post.slug);
        this.logger.log(`Blog post deleted: ${id}`);
        return { message: 'Post deleted successfully' };
    }
    formatPost(post, includeContent) {
        const formatted = {
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
            tags: post.tags.map((t) => t.tag),
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
    async invalidateBlogCaches(slug) {
        const promises = [
            this.cacheService.del(cache_constants_1.CACHE_KEYS.BLOG_POSTS_LIST(0, 10)),
            this.cacheService.del(cache_constants_1.CACHE_KEYS.BLOG_POSTS_FEATURED),
        ];
        if (slug) {
            promises.push(this.cacheService.del(cache_constants_1.CACHE_KEYS.BLOG_POST_BY_SLUG(slug)));
        }
        await Promise.all(promises);
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = BlogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], BlogService);
//# sourceMappingURL=blog.service.js.map