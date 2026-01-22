import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Request() req, @Body() createCartDto: CreateCartDto) {
    const customerId = req.user.id;
    return this.cartService.create(customerId, createCartDto);
  }

  @Get()
  findAll(@Request() req) {
    const customerId = req.user.id;
    return this.cartService.findAll(customerId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity') quantity: number,
  ) {
    const customerId = req.user.id;
    return this.cartService.updateQuantity(customerId, id, quantity);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const customerId = req.user.id;
    return this.cartService.remove(customerId, id);
  }

  @Delete()
  clear(@Request() req) {
    const customerId = req.user.id;
    return this.cartService.clearCart(customerId);
  }
}
