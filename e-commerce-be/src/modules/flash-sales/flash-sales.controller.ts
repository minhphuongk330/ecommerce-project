import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { FlashSalesService } from './flash-sales.service';

@Controller('flash-sales')
export class FlashSalesController {
  constructor(private readonly flashSalesService: FlashSalesService) { }

  @Get('active')
  findActive() {
    return this.flashSalesService.findActive();
  }

  @Get()
  findAll() {
    return this.flashSalesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.flashSalesService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.flashSalesService.create(body);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.flashSalesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.flashSalesService.remove(id);
  }
}
