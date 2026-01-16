import { UpdateProductDto } from './../products/dto/update-product.dto';
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../entities/customer.entity';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('customers')
  getCustomers() {
    return this.adminService.getCustomers();
  }

  @Get('products')
  getProducts() {
    return this.adminService.getProducts();
  }

  @Get('categories')
  getCategories() {
    return this.adminService.getCategories();
  }

  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.adminService.createProduct(dto);
  }

  @Put('products/:id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.adminService.updateProduct(id, dto);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteProduct(id);
  }

  @Get('orders')
  getOrders() {
    return this.adminService.getOrders();
  }

  @Get('orders/:id')
  getOrderDetail(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getOrderDetail(id);
  }

  @Patch('orders/:id/status')
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.adminService.updateOrderStatus(id, dto);
  }
}
