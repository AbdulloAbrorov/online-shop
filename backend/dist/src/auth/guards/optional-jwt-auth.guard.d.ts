import { ExecutionContext } from '@nestjs/common';
declare const OptionalJwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class OptionalJwtAuthGuard extends OptionalJwtAuthGuard_base {
    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, _status?: any): TUser;
    canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}
export {};
