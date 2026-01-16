import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Customer } from '../../entities/customer.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Profile } from 'src/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer,Profile]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): any => {
        return {
          secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
