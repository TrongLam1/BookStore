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
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { RolesGuard } from './auth/guard/roles.guard';
import { TransformInterceptor } from './interceptor/response';
import { VnpayModule } from './entities/vnpay/vnpay.module';
import { NotificationModule } from './entities/notification/notification.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

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
    VnpayModule,
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
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        synchronize: true,
        // logging: true
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    NotificationModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          // ignoreTLS: true,
          // secure: false,
          auth: {
            user: configService.get<string>('MAILDEV_INCOMING_USER'),
            pass: configService.get<string>('MAILDEV_INCOMING_PASS'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        // preview: true,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
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
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule { }
