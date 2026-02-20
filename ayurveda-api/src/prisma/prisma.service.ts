import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    
    if (!databaseUrl) {
      throw new Error(
        'DATABASE_URL is not defined. Please check your .env file.\n' +
        'Make sure DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ayurveda_admin is set'
      );
    }

    // Create PostgreSQL connection pool
    const pool = new Pool({
      connectionString: databaseUrl,
    });

    // Create Prisma adapter
    const adapter = new PrismaPg(pool);

    // Initialize PrismaClient with adapter
    super({
      adapter,
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'info', 'warn', 'error'] 
        : ['warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to database');
    } catch (error: any) {
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

  async enableShutdownHooks(app: any) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
