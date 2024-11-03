import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppConfigEnvironment } from './config/config.environment';
import { DatabaseModule } from './core/database/database.module';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersModule } from './modules/users/users.module';
import { envShema } from './config/env-shema';
import { AuthModule } from './modules/auth/auth.module';
import { AccessControlModule } from './modules/access-control/access-control.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './modules/products/products.module';
import { JsonMiddleware } from './core/middlewares/json.middleware';
import { CartModule } from './modules/cart/cart.module';
import { AddressModule } from './modules/address/address.module';
import { SalesModule } from './modules/sales/sales.module';
import { InsertDataService } from './core/services/insert-data.service';
import { HttpModule } from '@nestjs/axios';
import { OffersModule } from './modules/offers/offers.module';
import { BranchModule } from './modules/branch/branch.module';
import { ShippingsModule } from './modules/shippings/shippings.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
      isGlobal: true,
      load: [AppConfigEnvironment],
      validationSchema: envShema
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('keyJwt'),
        signOptions: {  expiresIn: '30m' }
      }),
      inject: [ConfigService],
      global: true
    }),
    DatabaseModule,
    MorganModule,
    HttpModule,
    UsersModule,
    AuthModule,
    AccessControlModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
    AddressModule,
    SalesModule,
    OffersModule,
    BranchModule,
    ShippingsModule,
    SubscriptionsModule,
    PurchaseModule,
    SuppliersModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor("combined"),
    },
    InsertDataService
  ],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JsonMiddleware).forRoutes(
    {
      path: '*',
      method: RequestMethod.POST
    }, 
    {
      path: '*',
      method: RequestMethod.PUT
    }
  );
  }
}
