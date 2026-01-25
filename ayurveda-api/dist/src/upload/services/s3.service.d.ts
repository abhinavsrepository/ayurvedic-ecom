import { ConfigService } from '@nestjs/config';
export interface S3UploadResult {
    key: string;
    url: string;
    bucket: string;
}
export declare class S3Service {
    private configService;
    private readonly logger;
    private readonly s3Client;
    private readonly bucket;
    private readonly region;
    private readonly cdnUrl?;
    constructor(configService: ConfigService);
    private generateFileName;
    upload(file: Buffer, originalName: string, mimeType: string, prefix?: string): Promise<S3UploadResult>;
    delete(key: string): Promise<void>;
    getSignedUrl(key: string, expiresIn?: number): Promise<string>;
    isConfigured(): boolean;
}
