import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { AdminModule } from './modules/admin/admin.module';
import { AttributeDefsModule } from './modules/attribute-defs/attribute-defs.module';
import { AuthModule } from './modules/auth/auth.module';
import { BannersModule } from './modules/banners/banners.module';
import { BrandsModule } from './modules/brands/brands.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { CustomerAddressesModule } from './modules/customer-addresses/customer-addresses.module';
import { CustomerCouponsModule } from './modules/customer-coupons/customer-coupons.module';
import { CustomersModule } from './modules/customers/customers.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { FlashSalesModule } from './modules/flash-sales/flash-sales.module';
import { MailModule } from './modules/mail/mail.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProductReviewsModule } from './modules/product-reviews/product-reviews.module';
import { ProductsModule } from './modules/products/products.module';
import { UploadModule } from './modules/upload/upload.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MailModule,
    TypeOrmModule.forRoot({
      ...(databaseConfig() as any),
      timezone: 'Z',
      ssl:
        process.env.DB_HOST === 'localhost'
          ? false
          : { rejectUnauthorized: false },
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      autoLoadEntities: true,
    }),
    BannersModule,
    BrandsModule,
    CategoriesModule,
    ProductsModule,
    AttributeDefsModule,
    CustomersModule,
    CustomerAddressesModule,
    OrdersModule,
    OrderItemsModule,
    AuthModule,
    UploadModule,
    ProductReviewsModule,
    FavoritesModule,
    AdminModule,
    CartModule,
    ChatbotModule,
    FlashSalesModule,
    CouponsModule,
    CustomerCouponsModule,
    PaymentsModule,
    ContactsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
