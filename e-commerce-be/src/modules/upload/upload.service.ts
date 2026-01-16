import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';

export interface ImgbbResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: number;
    height: number;
    size: number;
    time: number;
    expiration: number;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

@Injectable()
export class UploadService {
  private readonly imgbbApiKey: string;
  private readonly imgbbApiUrl = 'https://api.imgbb.com/1/upload';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('IMGBB_API_KEY');
    if (!apiKey) {
      throw new Error(
        'IMGBB_API_KEY is not configured in environment variables',
      );
    }
    this.imgbbApiKey = apiKey;
  }

  async uploadImage(file: Express.Multer.File): Promise<ImgbbResponse> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`,
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    try {
      // Convert buffer to base64
      const base64Image = file.buffer.toString('base64');

      const formData = new FormData();
      formData.append('image', base64Image);

      const response = await firstValueFrom(
        this.httpService.post<ImgbbResponse>(
          `${this.imgbbApiUrl}?key=${this.imgbbApiKey}`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
            },
          },
        ),
      );

      if (!response.data.success) {
        throw new BadRequestException('Failed to upload image to ImgBB');
      }

      return response.data;
    } catch (error: any) {
      if (error?.response) {
        throw new BadRequestException(
          `ImgBB API error: ${error.response.data?.error?.message || error.message}`,
        );
      }
      throw new BadRequestException(
        `Upload failed: ${error?.message || 'Unknown error'}`,
      );
    }
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
  ): Promise<ImgbbResponse[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }
}
