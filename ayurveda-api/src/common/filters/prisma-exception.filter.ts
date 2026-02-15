import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

// Type for Prisma known request errors
type PrismaClientKnownRequestError = {
  code: string;
  message: string;
  meta?: Record<string, any>;
};

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    // Check if it's a Prisma error
    if (
      !exception?.code ||
      typeof exception.code !== 'string' ||
      !exception.code.startsWith('P')
    ) {
      // Not a Prisma error, pass it through
      throw exception;
    }

    const prismaException = exception as PrismaClientKnownRequestError;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (prismaException.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = 'Unique constraint violation';
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'Foreign key constraint failed';
        break;
      default:
        message = prismaException.message;
    }

    this.logger.error(`Prisma Error: ${prismaException.code} - ${message}`);

    response.status(status).json({
      statusCode: status,
      message,
      error: 'Database Error',
      code: prismaException.code,
    });
  }
}
