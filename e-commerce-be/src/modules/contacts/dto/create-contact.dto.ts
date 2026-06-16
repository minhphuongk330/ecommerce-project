import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @IsString({ message: 'Tiêu đề phải là một chuỗi ký tự' })
  subject: string;

  @IsNotEmpty({ message: 'Nội dung phản hồi không được để trống' })
  @IsString({ message: 'Nội dung phải là một chuỗi ký tự' })
  @MinLength(10, { message: 'Nội dung phản hồi phải chứa tối thiểu 10 ký tự' })
  content: string;
}
