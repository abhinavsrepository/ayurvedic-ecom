export declare class PaginationDto {
    page?: number;
    size?: number;
    sort?: string;
}
export declare class PageMetaDto {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
    constructor(page: number, size: number, totalElements: number, numberOfElements: number);
}
export declare class PageDto<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
    constructor(content: T[], page: number, size: number, totalElements: number);
}
