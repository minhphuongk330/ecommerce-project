import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AttributeDefsService } from './attribute-defs.service';
import { CreateAttributeDefDto } from './dto/create-attribute-def.dto';
import { UpdateAttributeDefDto } from './dto/update-attribute-def.dto';

@Controller('attribute-defs')
export class AttributeDefsController {
  constructor(private readonly attributeDefsService: AttributeDefsService) {}

  @Post()
  create(@Body() createAttributeDefDto: CreateAttributeDefDto) {
    return this.attributeDefsService.create(createAttributeDefDto);
  }

  @Get()
  findAll() {
    return this.attributeDefsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attributeDefsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAttributeDefDto: UpdateAttributeDefDto,
  ) {
    return this.attributeDefsService.update(id, updateAttributeDefDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.attributeDefsService.remove(id);
  }
}

