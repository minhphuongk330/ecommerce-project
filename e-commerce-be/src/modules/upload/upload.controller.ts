import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import {
  UploadResponseDto,
  UploadMultipleResponseDto,
} from './dto/upload-response.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const result = await this.uploadService.uploadImage(file);
    return {
      success: result.success,
      status: result.status,
      data: result.data,
    };
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('images', 10)) // Max 10 files
  async uploadMultipleImages(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadMultipleResponseDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No image files provided');
    }

    const results = await this.uploadService.uploadMultipleImages(files);
    return {
      success: true,
      images: results.map((result) => result.data),
    };
  }
}
