import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';
import { CartModule } from '../cart/cart.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    ProductsModule,
    CategoriesModule,
    CartModule,
    FavoritesModule,
    OrdersModule,
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
