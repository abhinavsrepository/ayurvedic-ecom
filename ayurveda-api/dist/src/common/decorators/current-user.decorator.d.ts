export interface CurrentUserData {
    id: string;
    sub: string;
    customerId: string;
    username: string;
    email: string;
    roles: string[];
}
export declare const CurrentUser: (...dataOrPipes: (keyof CurrentUserData | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
