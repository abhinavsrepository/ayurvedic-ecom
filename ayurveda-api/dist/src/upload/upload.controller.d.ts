import type { Request } from 'express';
import { UploadService } from './upload.service';
import { UploadResponseDto } from './dto/upload-response.dto';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadImage(file: Express.Multer.File, request: Request): Promise<UploadResponseDto>;
    uploadMultipleImages(files: Express.Multer.File[], request: Request): Promise<UploadResponseDto[]>;
    deleteImage(id: string): Promise<void>;
}
