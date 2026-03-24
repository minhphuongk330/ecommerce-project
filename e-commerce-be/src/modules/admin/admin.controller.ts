import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { Role } from '../../entities/customer.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from './../products/dto/update-product.dto';
import { AdminService } from './admin.service';
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

  @Get('revenue')
  getRevenue(
    @Query('period') period: 'weekly' | 'monthly' | 'yearly' = 'monthly',
  ) {
    return this.adminService.getRevenueByPeriod(period);
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
