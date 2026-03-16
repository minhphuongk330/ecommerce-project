import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsArray()
  history?: any[];

  @IsOptional()
  @IsString()
  mode?: 'client' | 'admin';
}

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  async handleChat(
    @Body() body: ChatRequestDto,
    @Headers('authorization') authHeader?: string,
  ) {
    if (!body || !body.message) {
      throw new BadRequestException('Vui lòng gửi kèm nội dung message.');
    }

    let customerId: number | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const payload = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString(),
        );
        customerId = payload.id || payload.sub;
      } catch (error) {}
    }

    return this.chatbotService.chat(
      body.message,
      body.history || [],
      body.mode || 'client',
      customerId,
    );
  }
}
