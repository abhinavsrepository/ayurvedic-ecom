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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const config_1 = require("@nestjs/config");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    configService;
    logger = new common_1.Logger(PrismaService_1.name);
    constructor(configService) {
        const databaseUrl = configService.get('DATABASE_URL');
        if (!databaseUrl) {
            throw new Error('DATABASE_URL is not defined. Please check your .env file.\n' +
                'Make sure DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ayurveda_admin is set');
        }
        const pool = new pg_1.Pool({
            connectionString: databaseUrl,
        });
        const adapter = new adapter_pg_1.PrismaPg(pool);
        super({
            adapter,
            log: process.env.NODE_ENV === 'development'
                ? ['query', 'info', 'warn', 'error']
                : ['warn', 'error'],
        });
        this.configService = configService;
    }
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Successfully connected to database');
        }
        catch (error) {
            this.logger.error('Failed to connect to database:', error.message);
            this.logger.error('');
            this.logger.error('==============================================');
            this.logger.error('DATABASE CONNECTION ERROR');
            this.logger.error('==============================================');
            this.logger.error('');
            this.logger.error('Please make sure PostgreSQL is running:');
            this.logger.error('  - Local: Check Services app or run: Start-Service postgresql*');
            this.logger.error('  - Docker: docker-compose up -d');
            this.logger.error('');
            this.logger.error('Check your DATABASE_URL in .env file');
            this.logger.error('See SETUP_NO_DOCKER.md for more help');
            this.logger.error('==============================================');
            throw error;
        }
    }
    async enableShutdownHooks(app) {
        process.on('beforeExit', async () => {
            await app.close();
        });
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map