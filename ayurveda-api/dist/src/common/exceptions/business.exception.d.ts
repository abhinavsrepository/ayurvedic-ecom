import { HttpException, HttpStatus } from '@nestjs/common';
export declare class BusinessException extends HttpException {
    constructor(message: string, statusCode?: HttpStatus);
}
export declare class ResourceNotFoundException extends HttpException {
    constructor(resource: string, identifier?: string);
}
export declare class DuplicateResourceException extends HttpException {
    constructor(resource: string, field: string, value: string);
}
export declare class UnauthorizedException extends HttpException {
    constructor(message?: string);
}
export declare class ForbiddenException extends HttpException {
    constructor(message?: string);
}
export declare class ValidationException extends HttpException {
    constructor(errors: Record<string, string[]>);
}
