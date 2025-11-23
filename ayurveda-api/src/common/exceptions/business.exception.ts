import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(
      {
        statusCode,
        message,
        error: 'Business Logic Error',
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}

export class ResourceNotFoundException extends HttpException {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message,
        error: 'Not Found',
        timestamp: new Date().toISOString(),
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class DuplicateResourceException extends HttpException {
  constructor(resource: string, field: string, value: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: `${resource} with ${field} '${value}' already exists`,
        error: 'Duplicate Resource',
        timestamp: new Date().toISOString(),
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized access') {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message,
        error: 'Unauthorized',
        timestamp: new Date().toISOString(),
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Access forbidden') {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message,
        error: 'Forbidden',
        timestamp: new Date().toISOString(),
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class ValidationException extends HttpException {
  constructor(errors: Record<string, string[]>) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        errors,
        error: 'Validation Error',
        timestamp: new Date().toISOString(),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
