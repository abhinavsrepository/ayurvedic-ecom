import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

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
      this.logger.error('1. Start Docker Desktop');
      this.logger.error('2. Run: docker-compose up -d');
      this.logger.error('3. Or run: start-services.bat');
      this.logger.error('');
      this.logger.error('For more help, see SETUP.md');
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
