import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerAddress } from '../../entities/customer-address.entity';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from './dto/update-customer-address.dto';

@Injectable()
export class CustomerAddressesService {
  constructor(
    @InjectRepository(CustomerAddress)
    private readonly customerAddressRepository: Repository<CustomerAddress>,
  ) {}

  async create(
    createCustomerAddressDto: CreateCustomerAddressDto,
  ): Promise<CustomerAddress> {
    const customerAddress =
      this.customerAddressRepository.create(createCustomerAddressDto);
    return await this.customerAddressRepository.save(customerAddress);
  }

  async findAll(): Promise<CustomerAddress[]> {
    return await this.customerAddressRepository.find({
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<CustomerAddress> {
    const customerAddress = await this.customerAddressRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!customerAddress) {
      throw new NotFoundException(
        `CustomerAddress with ID ${id} not found`,
      );
    }
    return customerAddress;
  }

  async update(
    id: number,
    updateCustomerAddressDto: UpdateCustomerAddressDto,
  ): Promise<CustomerAddress> {
    const customerAddress = await this.findOne(id);
    Object.assign(customerAddress, updateCustomerAddressDto);
    return await this.customerAddressRepository.save(customerAddress);
  }

  async findByCustomerId(customerId: number): Promise<CustomerAddress[]> {
    return await this.customerAddressRepository.find({
      where: { customerId },
      relations: ['customer'],
    });
  }

  async remove(id: number): Promise<void> {
    const customerAddress = await this.findOne(id);
    await this.customerAddressRepository.softRemove(customerAddress);
  }
}

