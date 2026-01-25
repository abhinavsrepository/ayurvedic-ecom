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
exports.PageDto = exports.PageMetaDto = exports.PaginationDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class PaginationDto {
    page = 0;
    size = 20;
    sort;
}
exports.PaginationDto = PaginationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number (0-indexed)',
        minimum: 0,
        default: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        minimum: 1,
        maximum: 100,
        default: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], PaginationDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort field and direction (e.g., "createdAt,DESC")',
        example: 'createdAt,DESC',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaginationDto.prototype, "sort", void 0);
class PageMetaDto {
    page;
    size;
    totalElements;
    totalPages;
    first;
    last;
    numberOfElements;
    empty;
    constructor(page, size, totalElements, numberOfElements) {
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = Math.ceil(totalElements / size);
        this.first = page === 0;
        this.last = page >= this.totalPages - 1;
        this.numberOfElements = numberOfElements;
        this.empty = totalElements === 0;
    }
}
exports.PageMetaDto = PageMetaDto;
class PageDto {
    content;
    totalElements;
    totalPages;
    size;
    number;
    first;
    last;
    numberOfElements;
    empty;
    constructor(content, page, size, totalElements) {
        this.content = content;
        this.totalElements = totalElements;
        this.totalPages = Math.ceil(totalElements / size);
        this.size = size;
        this.number = page;
        this.first = page === 0;
        this.last = page >= this.totalPages - 1;
        this.numberOfElements = content.length;
        this.empty = totalElements === 0;
    }
}
exports.PageDto = PageDto;
//# sourceMappingURL=pagination.dto.js.map