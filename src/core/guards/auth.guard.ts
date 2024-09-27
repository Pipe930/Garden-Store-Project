import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if(!token) throw new UnauthorizedException("Token no provisto en la peticion");

    try {
      const payload = this.jwtService.verify(
        token,
        {
          secret: this.configService.get<string>('SECRET_JWT')
        }
      );

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException("El token ingresado no es valido");
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
