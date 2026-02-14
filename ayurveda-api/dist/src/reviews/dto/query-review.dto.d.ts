export declare enum ReviewSortBy {
    RECENT = "recent",
    HELPFUL = "helpful",
    RATING_HIGH = "rating_high",
    RATING_LOW = "rating_low"
}
export declare class QueryReviewDto {
    page?: number;
    size?: number;
    rating?: number;
    sortBy?: ReviewSortBy;
}
