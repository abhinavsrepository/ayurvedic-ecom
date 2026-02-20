/**
 * Cache Module
 *
 * Provides caching capabilities using Redis (if configured) or in-memory fallback.
 * Set REDIS_HOST in .env to enable Redis caching, otherwise uses in-memory cache.
 */

import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      useFactory: async () => {
        const redisHost = process.env.REDIS_HOST;
        const redisPort = parseInt(process.env.REDIS_PORT || '6379');
        
        // If no Redis host is set, use in-memory cache
        if (!redisHost) {
          console.log('ℹ️  Redis not configured, using in-memory cache');
          return {
            ttl: parseInt(process.env.CACHE_TTL || '3600') * 1000,
            max: 100,
          };
        }

        // Try to connect to Redis
        try {
          const store = await redisStore({
            socket: {
              host: redisHost,
              port: redisPort,
              connectTimeout: 5000,
            },
            password: process.env.REDIS_PASSWORD || undefined,
            database: parseInt(process.env.REDIS_DB || '0'),
            ttl: parseInt(process.env.CACHE_TTL || '3600') * 1000,
          });

          console.log('✅ Redis cache connected successfully');
          return {
            store: store as any,
            ttl: parseInt(process.env.CACHE_TTL || '3600') * 1000,
          };
        } catch (error) {
          console.warn(
            '⚠️  Redis connection failed, falling back to in-memory cache:',
            (error as Error).message,
          );
          return {
            ttl: parseInt(process.env.CACHE_TTL || '3600') * 1000,
            max: 100,
          };
        }
      },
    }),
  ],
  providers: [CacheService],
  exports: [NestCacheModule, CacheService],
})
export class CacheModule {}
