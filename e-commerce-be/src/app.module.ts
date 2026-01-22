import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { SeederModule } from './database/seeder.module';
import { AdminModule } from './modules/admin/admin.module';
import { AttributeDefsModule } from './modules/attribute-defs/attribute-defs.module';
import { AuthModule } from './modules/auth/auth.module';
import { BannersModule } from './modules/banners/banners.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CustomerAddressesModule } from './modules/customer-addresses/customer-addresses.module';
import { CustomersModule } from './modules/customers/customers.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductColorsModule } from './modules/product-colors/product-colors.module';
import { ProductImagesModule } from './modules/product-images/product-images.module';
import { ProductReviewsModule } from './modules/product-reviews/product-reviews.module';
import { ProductsModule } from './modules/products/products.module';
import { UploadModule } from './modules/upload/upload.module';
import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      ...(databaseConfig() as any),
      ssl:
        process.env.DB_HOST === 'localhost'
          ? false
          : {
              rejectUnauthorized: false,
            },
      synchronize: true,
      autoLoadEntities: true,
    }),
    BannersModule,
    CategoriesModule,
    ProductsModule,
    ProductImagesModule,
    ProductColorsModule,
    AttributeDefsModule,
    CustomersModule,
    CustomerAddressesModule,
    OrdersModule,
    OrderItemsModule,
    SeederModule,
    AuthModule,
    UploadModule,
    ProductReviewsModule,
    FavoritesModule,
    AdminModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
