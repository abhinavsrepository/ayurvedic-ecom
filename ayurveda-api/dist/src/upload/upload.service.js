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
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const s3_service_1 = require("./services/s3.service");
const image_processor_service_1 = require("./services/image-processor.service");
const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
let UploadService = UploadService_1 = class UploadService {
    prisma;
    s3Service;
    imageProcessor;
    logger = new common_1.Logger(UploadService_1.name);
    constructor(prisma, s3Service, imageProcessor) {
        this.prisma = prisma;
        this.s3Service = s3Service;
        this.imageProcessor = imageProcessor;
    }
    async uploadImage(file, uploadedBy) {
        try {
            this.validateImage(file);
            if (!this.s3Service.isConfigured()) {
                throw new common_1.InternalServerErrorException('S3 is not properly configured. Please set AWS credentials.');
            }
            const optimized = await this.imageProcessor.optimize(file.buffer);
            const thumbnail = await this.imageProcessor.generateThumbnail(file.buffer);
            const uploadResult = await this.s3Service.upload(optimized.buffer, file.originalname, 'image/webp', 'products');
            const thumbnailResult = await this.s3Service.upload(thumbnail.buffer, `thumb-${file.originalname}`, 'image/webp', 'products/thumbnails');
            const upload = await this.prisma.imageUpload.create({
                data: {
                    filename: uploadResult.key,
                    original_name: file.originalname,
                    mime_type: 'image/webp',
                    size_bytes: optimized.metadata.size,
                    s3_key: uploadResult.key,
                    s3_bucket: uploadResult.bucket,
                    url: uploadResult.url,
                    thumbnail_url: thumbnailResult.url,
                    width: optimized.metadata.width,
                    height: optimized.metadata.height,
                    uploaded_by: uploadedBy || null,
                },
            });
            this.logger.log(`Image uploaded: ${upload.id} - ${file.originalname}`);
            return {
                id: upload.id,
                url: upload.url,
                thumbnailUrl: upload.thumbnail_url || undefined,
                s3Key: upload.s3_key,
                originalName: upload.original_name,
                sizeBytes: upload.size_bytes,
                mimeType: upload.mime_type,
                width: upload.width || undefined,
                height: upload.height || undefined,
            };
        }
        catch (error) {
            this.logger.error(`Upload failed: ${error.message}`, error.stack);
            throw error;
        }
    }
    async uploadMultipleImages(files, uploadedBy) {
        try {
            const uploads = await Promise.all(files.map((file) => this.uploadImage(file, uploadedBy)));
            this.logger.log(`Uploaded ${uploads.length} images`);
            return uploads;
        }
        catch (error) {
            this.logger.error(`Multiple upload failed: ${error.message}`, error.stack);
            throw error;
        }
    }
    async deleteImage(id) {
        try {
            const upload = await this.prisma.imageUpload.findUnique({
                where: { id },
            });
            if (!upload) {
                throw new common_1.BadRequestException(`Image upload with ID '${id}' not found`);
            }
            await this.s3Service.delete(upload.s3_key);
            if (upload.thumbnail_url) {
                const thumbKey = upload.thumbnail_url.split('/').pop();
                if (thumbKey) {
                    await this.s3Service.delete(`products/thumbnails/${thumbKey}`);
                }
            }
            await this.prisma.imageUpload.delete({
                where: { id },
            });
            this.logger.log(`Image deleted: ${id}`);
        }
        catch (error) {
            this.logger.error(`Delete failed: ${error.message}`, error.stack);
            throw error;
        }
    }
    validateImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`);
        }
        if (file.size > MAX_FILE_SIZE) {
            throw new common_1.BadRequestException(`File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        s3_service_1.S3Service,
        image_processor_service_1.ImageProcessorService])
], UploadService);
//# sourceMappingURL=upload.service.js.map