import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: any) => {
          if (req && req.query && req.query.token) {
            console.log('[JwtStrategy] Extracted token from query params:', req.query.token.substring(0, 15) + '...');
            return req.query.token as string;
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    console.log('[JwtStrategy] Validating JWT payload sub (customerId):', payload.sub);
    const customer = await this.authService.validateCustomer(payload.sub);
    if (!customer) {
      console.log('[JwtStrategy] Customer validation failed for ID:', payload.sub);
      throw new UnauthorizedException();
    }

    console.log('[JwtStrategy] Customer validated successfully:', customer.fullName, `(Role: ${customer.role})`);
    return {
      id: customer.id,
      email: customer.email,
      fullName: customer.fullName,
      role: customer.role,
    };
  }
}
