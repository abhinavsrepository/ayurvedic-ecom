export interface ImageMetadata {
    width: number;
    height: number;
    format: string;
    size: number;
}
export interface ProcessedImage {
    buffer: Buffer;
    metadata: ImageMetadata;
}
export declare class ImageProcessorService {
    private readonly logger;
    private readonly MAX_WIDTH;
    private readonly MAX_HEIGHT;
    private readonly THUMB_WIDTH;
    private readonly THUMB_HEIGHT;
    optimize(imageBuffer: Buffer): Promise<ProcessedImage>;
    generateThumbnail(imageBuffer: Buffer): Promise<ProcessedImage>;
    getMetadata(imageBuffer: Buffer): Promise<ImageMetadata>;
    isValidImage(buffer: Buffer): Promise<boolean>;
}
