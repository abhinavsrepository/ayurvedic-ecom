"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationException = exports.ForbiddenException = exports.UnauthorizedException = exports.DuplicateResourceException = exports.ResourceNotFoundException = exports.BusinessException = void 0;
const common_1 = require("@nestjs/common");
class BusinessException extends common_1.HttpException {
    constructor(message, statusCode = common_1.HttpStatus.BAD_REQUEST) {
        super({
            statusCode,
            message,
            error: 'Business Logic Error',
            timestamp: new Date().toISOString(),
        }, statusCode);
    }
}
exports.BusinessException = BusinessException;
class ResourceNotFoundException extends common_1.HttpException {
    constructor(resource, identifier) {
        const message = identifier
            ? `${resource} with identifier '${identifier}' not found`
            : `${resource} not found`;
        super({
            statusCode: common_1.HttpStatus.NOT_FOUND,
            message,
            error: 'Not Found',
            timestamp: new Date().toISOString(),
        }, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.ResourceNotFoundException = ResourceNotFoundException;
class DuplicateResourceException extends common_1.HttpException {
    constructor(resource, field, value) {
        super({
            statusCode: common_1.HttpStatus.CONFLICT,
            message: `${resource} with ${field} '${value}' already exists`,
            error: 'Duplicate Resource',
            timestamp: new Date().toISOString(),
        }, common_1.HttpStatus.CONFLICT);
    }
}
exports.DuplicateResourceException = DuplicateResourceException;
class UnauthorizedException extends common_1.HttpException {
    constructor(message = 'Unauthorized access') {
        super({
            statusCode: common_1.HttpStatus.UNAUTHORIZED,
            message,
            error: 'Unauthorized',
            timestamp: new Date().toISOString(),
        }, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends common_1.HttpException {
    constructor(message = 'Access forbidden') {
        super({
            statusCode: common_1.HttpStatus.FORBIDDEN,
            message,
            error: 'Forbidden',
            timestamp: new Date().toISOString(),
        }, common_1.HttpStatus.FORBIDDEN);
    }
}
exports.ForbiddenException = ForbiddenException;
class ValidationException extends common_1.HttpException {
    constructor(errors) {
        super({
            statusCode: common_1.HttpStatus.BAD_REQUEST,
            message: 'Validation failed',
            errors,
            error: 'Validation Error',
            timestamp: new Date().toISOString(),
        }, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.ValidationException = ValidationException;
//# sourceMappingURL=business.exception.js.map