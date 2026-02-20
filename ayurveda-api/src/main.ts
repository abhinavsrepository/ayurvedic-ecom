import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

// Fix for BigInt serialization in JSON
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGINS')?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Refresh-Token', 'X-Session-Id'],
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters
  app.useGlobalFilters(new AllExceptionsFilter(), new PrismaExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Prisma shutdown hook
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Ayurveda E-Commerce API')
    .setDescription(
      'Complete enterprise backend with Auth, Products, Orders, Payments, ML',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey(
      { type: 'apiKey', name: 'X-Refresh-Token', in: 'header' },
      'refresh-token',
    )
    .addTag('Authentication')
    .addTag('Products')
    .addTag('Orders')
    .addTag('Customers')
    .addTag('Payments')
    .addTag('Admin')
    .addTag('Health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
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
