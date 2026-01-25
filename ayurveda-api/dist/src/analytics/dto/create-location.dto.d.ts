export declare enum LocationAccuracy {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
export declare class CreateLocationDto {
    userId?: string;
    sessionId?: string;
    ip?: string;
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    accuracy?: LocationAccuracy;
}
