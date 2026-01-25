"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheTTL = exports.CacheKey = exports.HttpCacheInterceptor = exports.CACHE_TTL_METADATA = exports.CACHE_KEY_METADATA = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const cache_service_1 = require("./cache.service");
const core_1 = require("@nestjs/core");
exports.CACHE_KEY_METADATA = 'cache_key';
exports.CACHE_TTL_METADATA = 'cache_ttl';
let HttpCacheInterceptor = class HttpCacheInterceptor {
    cacheService;
    reflector;
    constructor(cacheService, reflector) {
        this.cacheService = cacheService;
        this.reflector = reflector;
    }
    async intercept(context, next) {
        const cacheKey = this.reflector.get(exports.CACHE_KEY_METADATA, context.getHandler());
        const cacheTTL = this.reflector.get(exports.CACHE_TTL_METADATA, context.getHandler());
        if (!cacheKey) {
            return next.handle();
        }
        const cachedResponse = await this.cacheService.get(cacheKey);
        if (cachedResponse) {
            return (0, rxjs_1.of)(cachedResponse);
        }
        return next.handle().pipe((0, operators_1.tap)(async (response) => {
            await this.cacheService.set(cacheKey, response, cacheTTL);
        }));
    }
};
exports.HttpCacheInterceptor = HttpCacheInterceptor;
exports.HttpCacheInterceptor = HttpCacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        core_1.Reflector])
], HttpCacheInterceptor);
const CacheKey = (key) => {
    return (target, propertyKey, descriptor) => {
        Reflect.defineMetadata(exports.CACHE_KEY_METADATA, key, descriptor.value);
        return descriptor;
    };
};
exports.CacheKey = CacheKey;
const CacheTTL = (ttl) => {
    return (target, propertyKey, descriptor) => {
        Reflect.defineMetadata(exports.CACHE_TTL_METADATA, ttl, descriptor.value);
        return descriptor;
    };
};
exports.CacheTTL = CacheTTL;
//# sourceMappingURL=http-cache.interceptor.js.map