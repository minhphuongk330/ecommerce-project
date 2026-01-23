import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { Customer } from '../../entities/customer.entity';
import { Profile } from '../../entities/profile.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Role } from '../../entities/customer.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    private readonly jwtService: JwtService,

    private readonly mailerService: MailerService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, fullName } = registerDto;

    const existingCustomer = await this.customerRepository.findOne({
      where: { email },
    });

    if (existingCustomer) {
      throw new ConflictException('Email already exists');
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const customer = this.customerRepository.create({
      email,
      passwordHash,
      fullName,
      isActive: true,
      role: Role.CUSTOMER,
    });

    const savedCustomer = await this.customerRepository.save(customer);

    const payload = {
      sub: savedCustomer.id,
      email: savedCustomer.email,
      role: savedCustomer.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      customer: {
        id: savedCustomer.id,
        email: savedCustomer.email,
        fullName: savedCustomer.fullName,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const customer = await this.customerRepository.findOne({
      where: { email },
    });

    if (!customer) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    if (!customer.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      customer.passwordHash,
    );

    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    const payload = {
      sub: customer.id,
      email: customer.email,
      role: customer.role,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      customer: {
        id: customer.id,
        email: customer.email,
        fullName: customer.fullName,
      },
    };
  }

  async validateCustomer(customerId: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customer || !customer.isActive) {
      throw new UnauthorizedException('Invalid or inactive customer');
    }
    return customer;
  }
  async getProfile(customerId: number) {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
      relations: ['profile'],
    });
    if (!customer) {
      throw new NotFoundException('User not found');
    }
    return {
      id: customer.id,
      email: customer.email,
      fullName: customer.fullName,
      role: customer.role,
      phoneNumber: customer.profile?.phoneNumber || null,
      gender: customer.profile?.gender || null,
      dateOfBirth: customer.profile?.dateOfBirth || null,
    };
  }

  async updateProfile(customerId: number, dto: UpdateProfileDto) {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
      relations: ['profile'],
    });
    if (!customer) {
      throw new NotFoundException('User not found');
    }
    if (dto.fullName) {
      customer.fullName = dto.fullName;
      await this.customerRepository.save(customer);
    }
    if (!customer.profile) {
      customer.profile = new Profile();
      customer.profile.customer = customer;
    }
    if (dto.phoneNumber !== undefined)
      customer.profile.phoneNumber = dto.phoneNumber;
    if (dto.gender !== undefined) customer.profile.gender = dto.gender;
    if (dto.dateOfBirth !== undefined)
      customer.profile.dateOfBirth = dto.dateOfBirth;
    await this.profileRepository.save(customer.profile);
    return this.getProfile(customerId);
  }
  async changePassword(customerId: number, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      customer.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }
    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    customer.passwordHash = passwordHash;
    await this.customerRepository.save(customer);
    return { message: 'Password changed successfully' };
  }
  async forgotPassword(dto: ForgotPasswordDto) {
    const { email } = dto;
    const customer = await this.customerRepository.findOne({
      where: { email },
    });
    if (!customer) {
      throw new NotFoundException('Email not registered');
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);
    customer.resetPasswordToken = otp;
    customer.resetPasswordExpires = expires;
    await this.customerRepository.save(customer);
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '[YOUR APP] Reset Password OTP',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #2c3e50;">Password Reset Request</h2>
            <p>Hello <strong>${customer.fullName}</strong>,</p>
            <p>You requested to reset your password. Here is your OTP code:</p>
            <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; width: fit-content; margin: 20px 0;">
              <h1 style="color: #333; letter-spacing: 5px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
            <p style="color: #999; font-size: 12px;">If you did not request this, please ignore this email.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new HttpException(
        'Error sending email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { message: 'OTP sent to your email' };
  }
  async resetPassword(dto: ResetPasswordDto) {
    const { email, otp, newPassword, confirmPassword } = dto;
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const customer = await this.customerRepository.findOne({
      where: { email },
    });
    if (!customer) {
      throw new NotFoundException('User not found');
    }
    if (!customer.resetPasswordToken || customer.resetPasswordToken !== otp) {
      throw new BadRequestException('Invalid OTP');
    }
    const now = new Date();
    if (!customer.resetPasswordExpires || now > customer.resetPasswordExpires) {
      throw new BadRequestException('OTP has expired');
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    customer.passwordHash = passwordHash;
    customer.resetPasswordToken = null;
    customer.resetPasswordExpires = null;
    await this.customerRepository.save(customer);
    return { message: 'Password reset successfully' };
  }
}
