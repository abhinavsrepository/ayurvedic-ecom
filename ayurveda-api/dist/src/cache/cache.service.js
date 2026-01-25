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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
let CacheService = CacheService_1 = class CacheService {
    cacheManager;
    logger = new common_1.Logger(CacheService_1.name);
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
    }
    async get(key) {
        try {
            const value = await this.cacheManager.get(key);
            if (value) {
                this.logger.debug(`Cache HIT: ${key}`);
            }
            else {
                this.logger.debug(`Cache MISS: ${key}`);
            }
            return value;
        }
        catch (error) {
            this.logger.error(`Cache GET error for key ${key}:`, error);
            return undefined;
        }
    }
    async set(key, value, ttl) {
        try {
            await this.cacheManager.set(key, value, ttl);
            this.logger.debug(`Cache SET: ${key} (TTL: ${ttl || 'default'})`);
        }
        catch (error) {
            this.logger.error(`Cache SET error for key ${key}:`, error);
        }
    }
    async del(key) {
        try {
            await this.cacheManager.del(key);
            this.logger.debug(`Cache DEL: ${key}`);
        }
        catch (error) {
            this.logger.error(`Cache DEL error for key ${key}:`, error);
        }
    }
    async delPattern(pattern) {
        try {
            this.logger.debug(`Cache DEL pattern: ${pattern}`);
        }
        catch (error) {
            this.logger.error(`Cache DEL pattern error for ${pattern}:`, error);
        }
    }
    async reset() {
        try {
            this.logger.warn('Cache RESET: Not implemented - would need Redis client access');
        }
        catch (error) {
            this.logger.error('Cache RESET error:', error);
        }
    }
    async wrap(key, fn, ttl) {
        try {
            const cached = await this.get(key);
            if (cached !== undefined) {
                return cached;
            }
            const result = await fn();
            await this.set(key, result, ttl);
            return result;
        }
        catch (error) {
            this.logger.error(`Cache WRAP error for key ${key}:`, error);
            return fn();
        }
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], CacheService);
//# sourceMappingURL=cache.service.js.map