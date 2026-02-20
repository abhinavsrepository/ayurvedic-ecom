"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const prisma_service_1 = require("./prisma/prisma.service");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const prisma_exception_filter_1 = require("./common/filters/prisma-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
BigInt.prototype.toJSON = function () {
    return this.toString();
};
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug'],
    });
    const configService = app.get(config_1.ConfigService);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: configService.get('CORS_ORIGINS')?.split(',') || [
            'http://localhost:3000',
            'http://localhost:3001',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Refresh-Token', 'X-Session-Id'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter(), new prisma_exception_filter_1.PrismaExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    const prismaService = app.get(prisma_service_1.PrismaService);
    await prismaService.enableShutdownHooks(app);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Ayurveda E-Commerce API')
        .setDescription('Complete enterprise backend with Auth, Products, Orders, Payments, ML')
        .setVersion('1.0')
        .addBearerAuth()
        .addApiKey({ type: 'apiKey', name: 'X-Refresh-Token', in: 'header' }, 'refresh-token')
        .addTag('Authentication')
        .addTag('Products')
        .addTag('Orders')
        .addTag('Customers')
        .addTag('Payments')
        .addTag('Admin')
        .addTag('Health')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
        },
    });
    const port = configService.get('PORT') || 3333;
    await app.listen(port);
    console.log('');
    console.log('ðŸš€ ========================================');
    console.log('ðŸš€  Ayurveda E-Commerce API');
    console.log('ðŸš€ ========================================');
    console.log(`ðŸš€  Application: http://localhost:${port}`);
    console.log(`ðŸ“š  Swagger: http://localhost:${port}/api-docs`);
    console.log(`â¤ï¸   Health: http://localhost:${port}/api/actuator/health`);
    console.log(`ðŸ”  Auth: JWT + 2FA + RBAC`);
    console.log(`ðŸ“¦  Products: CRUD + Search`);
    console.log(`ðŸ“‹  Orders: Management + Analytics`);
    console.log('ðŸš€ ========================================');
    console.log('');
}
bootstrap();
//# sourceMappingURL=main.js.map