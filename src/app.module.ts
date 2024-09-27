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
        signOptions: {  expiresIn: '60m' }
      }),
      inject: [ConfigService],
      global: true
    }),
    DatabaseModule,
    MorganModule,
    UsersModule,
    AuthModule,
    AccessControlModule,
    CategoriesModule,
    ProductsModule,
    CartModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor("combined"),
    }
  ]
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
