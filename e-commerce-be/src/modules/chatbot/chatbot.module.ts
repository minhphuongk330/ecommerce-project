import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { CartModule } from '../cart/cart.module';
import { CategoriesModule } from '../categories/categories.module';
import { CustomersModule } from '../customers/customers.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';
import { ChatbotController } from './chatbot.controller';
import { ChatbotAdminService } from './chatbot-admin.service';
import { ChatbotClientService } from './chatbot-client.service';
import { ChatbotService } from './chatbot.service';

@Module({
  imports: [
    ProductsModule,
    CategoriesModule,
    CartModule,
    FavoritesModule,
    OrdersModule,
    AdminModule,
    CustomersModule,
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService, ChatbotClientService, ChatbotAdminService],
})
export class ChatbotModule {}
