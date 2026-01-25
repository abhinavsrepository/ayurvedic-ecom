import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from './services/s3.service';
import { ImageProcessorService } from './services/image-processor.service';
import { UploadResponseDto } from './dto/upload-response.dto';
export declare class UploadService {
    private prisma;
    private s3Service;
    private imageProcessor;
    private readonly logger;
    constructor(prisma: PrismaService, s3Service: S3Service, imageProcessor: ImageProcessorService);
    uploadImage(file: Express.Multer.File, uploadedBy?: string): Promise<UploadResponseDto>;
    uploadMultipleImages(files: Express.Multer.File[], uploadedBy?: string): Promise<UploadResponseDto[]>;
    deleteImage(id: string): Promise<void>;
    private validateImage;
}
