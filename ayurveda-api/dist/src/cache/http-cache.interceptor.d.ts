import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CacheService } from './cache.service';
import { Reflector } from '@nestjs/core';
export declare const CACHE_KEY_METADATA = "cache_key";
export declare const CACHE_TTL_METADATA = "cache_ttl";
export declare class HttpCacheInterceptor implements NestInterceptor {
    private cacheService;
    private reflector;
    constructor(cacheService: CacheService, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
export declare const CacheKey: (key: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare const CacheTTL: (ttl: number) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
