import { Gender } from '../../../entities/profile.entity';

export class UpdateProfileDto {
  fullName: string;
  phoneNumber?: string;
  gender?: Gender;
  dateOfBirth?: string;
}
