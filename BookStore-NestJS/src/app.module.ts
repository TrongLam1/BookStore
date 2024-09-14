import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './entities/users/users.module';
import { BooksModule } from './entities/books/books.module';
import { BrandModule } from './entities/brand/brand.module';
import { CartItemModule } from './entities/cart-item/cart-item.module';
import { CategoryModule } from './entities/category/category.module';
import { CommentsModule } from './entities/comments/comments.module';
import { CouponsModule } from './entities/coupons/coupons.module';
import { OrderItemModule } from './entities/order-item/order-item.module';
import { OrdersModule } from './entities/orders/orders.module';
import { ShoppingCartModule } from './entities/shopping-cart/shopping-cart.module';
import { TypeModule } from './entities/type/type.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { RolesGuard } from './auth/guard/roles.guard';

@Module({
  imports: [
    UsersModule,
    BooksModule,
    BrandModule,
    CartItemModule,
    CategoryModule,
    CommentsModule,
    CouponsModule,
    OrderItemModule,
    OrdersModule,
    ShoppingCartModule,
    TypeModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        // entities: ["dist/**/*.entity.js"],
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
