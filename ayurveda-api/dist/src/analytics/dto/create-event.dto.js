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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEventDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const create_location_dto_1 = require("./create-location.dto");
const create_device_dto_1 = require("./create-device.dto");
class CreateEventDto {
    userId;
    sessionId;
    eventType;
    eventData;
    location;
    device;
    pageUrl;
    referrer;
}
exports.CreateEventDto = CreateEventDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID (optional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Session ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Event type',
        example: 'session_start',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Event data (JSON object)',
        example: { productId: '123', action: 'view' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateEventDto.prototype, "eventData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Location data' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", create_location_dto_1.CreateLocationDto)
], CreateEventDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Device data' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", create_device_dto_1.CreateDeviceDto)
], CreateEventDto.prototype, "device", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "pageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Referrer URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "referrer", void 0);
//# sourceMappingURL=create-event.dto.js.map