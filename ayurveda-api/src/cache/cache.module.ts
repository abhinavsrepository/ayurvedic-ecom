/**
 * Redis Cache Module
 *
 * Provides enterprise-grade caching capabilities using Redis.
 * Integrates with @nestjs/cache-manager for seamless caching across the application.
 */

import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync<RedisClientOptions>({
      useFactory: async () => {
        try {
          const store = await redisStore({
            socket: {
              host: process.env.REDIS_HOST || 'localhost',
              port: parseInt(process.env.REDIS_PORT || '6379'),
              connectTimeout: 5000,
            },
            password: process.env.REDIS_PASSWORD,
            database: parseInt(process.env.REDIS_DB || '0'),
            ttl: parseInt(process.env.CACHE_TTL || '3600') * 1000, // Convert to ms
          });

          return {
            store,
            ttl: parseInt(process.env.CACHE_TTL || '3600') * 1000,
          } as any;
        } catch (error) {
          console.warn('Redis connection failed, using in-memory cache instead:', error.message);
          // Fallback to in-memory cache if Redis is not available
          return {
            ttl: parseInt(process.env.CACHE_TTL || '3600') * 1000,
            max: 100,
          } as any;
        }
      },
    }),
  ],
  providers: [CacheService],
  exports: [NestCacheModule, CacheService],
})
export class CacheModule {}
