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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const blog_service_1 = require("./blog.service");
const create_post_dto_1 = require("./dto/create-post.dto");
const update_post_dto_1 = require("./dto/update-post.dto");
const query_post_dto_1 = require("./dto/query-post.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let BlogController = class BlogController {
    blogService;
    constructor(blogService) {
        this.blogService = blogService;
    }
    async findAll(query) {
        return this.blogService.findAll(query, false);
    }
    async findBySlug(slug) {
        return this.blogService.findBySlug(slug);
    }
    async getCategories() {
        return this.blogService.getCategories();
    }
    async getTags() {
        return this.blogService.getTags();
    }
    async findAllAdmin(query) {
        return this.blogService.findAll(query, true);
    }
    async findById(id) {
        return this.blogService.findById(id);
    }
    async create(dto, authorId) {
        return this.blogService.create(dto, authorId);
    }
    async update(id, dto) {
        return this.blogService.update(id, dto);
    }
    async delete(id) {
        return this.blogService.delete(id);
    }
};
exports.BlogController = BlogController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('posts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all blog posts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Posts retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_post_dto_1.QueryPostDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('posts/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get post by slug' }),
    (0, swagger_1.ApiParam)({ name: 'slug', description: 'Post slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Post found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Post not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "findBySlug", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all blog categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getCategories", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('tags'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all blog tags' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tags retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getTags", null);
__decorate([
    (0, common_1.Get)('admin/posts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all posts (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Posts retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_post_dto_1.QueryPostDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "findAllAdmin", null);
__decorate([
    (0, common_1.Get)('admin/posts/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get post by ID (Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Post ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Post found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Post not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)('posts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new blog post (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Post created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Slug already exists' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_dto_1.CreatePostDto, String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('posts/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a blog post (Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Post ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Post updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Post not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Slug already exists' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_post_dto_1.UpdatePostDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('posts/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a blog post (Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Post ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Post deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Post not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "delete", null);
exports.BlogController = BlogController = __decorate([
    (0, swagger_1.ApiTags)('Blog'),
    (0, common_1.Controller)('blog'),
    __metadata("design:paramtypes", [blog_service_1.BlogService])
], BlogController);
//# sourceMappingURL=blog.controller.js.map