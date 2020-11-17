import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { CityWeatherModule } from './modules/city-weather/city-weather.module';
import { CityModule } from './modules/city/city-weather.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { APP_CONFIG } from './app.config';

@Module({
  imports: [
    CacheModule.register({
      ttl: APP_CONFIG.apiCacheTtlInSeconds,
    }),
    MongooseModule.forRoot(APP_CONFIG.mongodbUri, {
      useNewUrlParser: true,
    }),
    CityModule,
    CityWeatherModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
