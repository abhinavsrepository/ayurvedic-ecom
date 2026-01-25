export declare class IpHasher {
    static hash(ip: string, salt?: string): string;
    static anonymize(ip: string): string;
    static extractIp(headers: any): string;
}
