"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_redis_yet_1 = require("cache-manager-redis-yet");
const cache_service_1 = require("./cache.service");
let CacheModule = class CacheModule {
};
exports.CacheModule = CacheModule;
exports.CacheModule = CacheModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                useFactory: async () => {
                    try {
                        const store = await (0, cache_manager_redis_yet_1.redisStore)({
                            socket: {
                                host: process.env.REDIS_HOST || 'localhost',
                                port: parseInt(process.env.REDIS_PORT || '6379'),
                                connectTimeout: 5000,
                            },
                            password: process.env.REDIS_PASSWORD,
                            database: parseInt(process.env.REDIS_DB || '0'),
                            ttl: parseInt(process.env.CACHE_TTL || '3600') * 1000,
                        });
                        return {
                            store,
                            ttl: parseInt(process.env.CACHE_TTL || '3600') * 1000,
                        };
                    }
                    catch (error) {
                        console.warn('Redis connection failed, using in-memory cache instead:', error.message);
                        return {
                            ttl: parseInt(process.env.CACHE_TTL || '3600') * 1000,
                            max: 100,
                        };
                    }
                },
            }),
        ],
        providers: [cache_service_1.CacheService],
        exports: [cache_manager_1.CacheModule, cache_service_1.CacheService],
    })
], CacheModule);
//# sourceMappingURL=cache.module.js.map