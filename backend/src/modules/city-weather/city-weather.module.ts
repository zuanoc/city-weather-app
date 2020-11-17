import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CityWeatherController } from './city-weather.controller';
import { CityWeatherService } from './weather-service/city-weather.service';
import { CityWeather, CityWeatherSchema } from './city-weather.schema';
import { WeatherDataFetchingCron } from './cron/weather-data-fetching-cron';
import { CityModule } from '../city/city-weather.module';
import { OpenWeatherMapDataService } from './weather-service/open-weather-map.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CityWeather.name, schema: CityWeatherSchema },
    ]),
    CityModule,
  ],
  controllers: [CityWeatherController],
  providers: [
    CityWeatherService,
    WeatherDataFetchingCron,
    {
      provide: 'WeatherDataService',
      useClass: OpenWeatherMapDataService,
    },
  ],
})
export class CityWeatherModule {}
