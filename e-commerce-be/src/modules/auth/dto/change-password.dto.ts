import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  currentPassword: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  newPassword: string;

  @IsNotEmpty()
  confirmPassword: string;
}
