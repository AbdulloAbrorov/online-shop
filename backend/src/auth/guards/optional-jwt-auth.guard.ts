import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    _status?: any,
  ): TUser {
    void err;
    void info;
    void context;
    void _status;
    return user as TUser;
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
    }>();
    const authHeader: string | undefined = request.headers['authorization'];

    if (!authHeader) {
      return true;
    }
    return super.canActivate(context) as Promise<boolean>;
  }
}
