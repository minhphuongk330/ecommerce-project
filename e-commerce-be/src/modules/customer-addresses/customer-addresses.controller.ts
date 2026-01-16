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
import { CustomerAddressesService } from './customer-addresses.service';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from './dto/update-customer-address.dto';

@Controller('customer-addresses')
export class CustomerAddressesController {
  constructor(
    private readonly customerAddressesService: CustomerAddressesService,
  ) {}

  @Post()
  create(@Body() createCustomerAddressDto: CreateCustomerAddressDto) {
    return this.customerAddressesService.create(createCustomerAddressDto);
  }

  @Get()
  findAll() {
    return this.customerAddressesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customerAddressesService.findOne(id);
  }

  @Get('customer/:customerId')
  findByCustomerId(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.customerAddressesService.findByCustomerId(customerId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerAddressDto: UpdateCustomerAddressDto,
  ) {
    return this.customerAddressesService.update(id, updateCustomerAddressDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customerAddressesService.remove(id);
  }
}

