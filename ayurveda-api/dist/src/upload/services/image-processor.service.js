"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ImageProcessorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageProcessorService = void 0;
const common_1 = require("@nestjs/common");
const sharp_1 = __importDefault(require("sharp"));
let ImageProcessorService = ImageProcessorService_1 = class ImageProcessorService {
    logger = new common_1.Logger(ImageProcessorService_1.name);
    MAX_WIDTH = 2000;
    MAX_HEIGHT = 2000;
    THUMB_WIDTH = 400;
    THUMB_HEIGHT = 400;
    async optimize(imageBuffer) {
        try {
            const processed = await (0, sharp_1.default)(imageBuffer)
                .resize(this.MAX_WIDTH, this.MAX_HEIGHT, {
                fit: 'inside',
                withoutEnlargement: true,
            })
                .webp({ quality: 85 })
                .toBuffer({ resolveWithObject: true });
            return {
                buffer: processed.data,
                metadata: {
                    width: processed.info.width,
                    height: processed.info.height,
                    format: processed.info.format,
                    size: processed.info.size,
                },
            };
        }
        catch (error) {
            this.logger.error(`Failed to optimize image: ${error.message}`, error.stack);
            throw error;
        }
    }
    async generateThumbnail(imageBuffer) {
        try {
            const processed = await (0, sharp_1.default)(imageBuffer)
                .resize(this.THUMB_WIDTH, this.THUMB_HEIGHT, {
                fit: 'cover',
                position: 'center',
            })
                .webp({ quality: 80 })
                .toBuffer({ resolveWithObject: true });
            return {
                buffer: processed.data,
                metadata: {
                    width: processed.info.width,
                    height: processed.info.height,
                    format: processed.info.format,
                    size: processed.info.size,
                },
            };
        }
        catch (error) {
            this.logger.error(`Failed to generate thumbnail: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getMetadata(imageBuffer) {
        try {
            const metadata = await (0, sharp_1.default)(imageBuffer).metadata();
            return {
                width: metadata.width || 0,
                height: metadata.height || 0,
                format: metadata.format || 'unknown',
                size: imageBuffer.length,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get image metadata: ${error.message}`, error.stack);
            throw error;
        }
    }
    async isValidImage(buffer) {
        try {
            await (0, sharp_1.default)(buffer).metadata();
            return true;
        }
        catch {
            return false;
        }
    }
};
exports.ImageProcessorService = ImageProcessorService;
exports.ImageProcessorService = ImageProcessorService = ImageProcessorService_1 = __decorate([
    (0, common_1.Injectable)()
], ImageProcessorService);
//# sourceMappingURL=image-processor.service.js.map