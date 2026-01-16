import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerAddressesService } from './customer-addresses.service';
import { CustomerAddressesController } from './customer-addresses.controller';
import { CustomerAddress } from '../../entities/customer-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerAddress])],
  controllers: [CustomerAddressesController],
  providers: [CustomerAddressesService],
  exports: [CustomerAddressesService],
})
export class CustomerAddressesModule {}

