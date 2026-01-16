import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeDefsService } from './attribute-defs.service';
import { AttributeDefsController } from './attribute-defs.controller';
import { AttributeDef } from '../../entities/attribute-def.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttributeDef])],
  controllers: [AttributeDefsController],
  providers: [AttributeDefsService],
  exports: [AttributeDefsService],
})
export class AttributeDefsModule {}

