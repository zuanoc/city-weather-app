import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WeatherDataService } from '../weather-service/open-weather-map.service';
import { CityWeatherService } from '../weather-service/city-weather.service';
import { CityWeather } from '../city-weather.schema';
import { APP_CONFIG } from '../../../app.config';
import { City, CityService } from '../../city/city.service';

@Injectable()
export class WeatherDataFetchingCron {
  private readonly logger = new Logger(WeatherDataFetchingCron.name);

  constructor(
    private readonly cityWeatherService: CityWeatherService,
    private readonly cityService: CityService,
    @Inject('WeatherDataService')
    private readonly weatherDataService: WeatherDataService,
  ) {}

  @Cron(`*/${APP_CONFIG.weatherFetchingInternalInSeconds} * * * * *`)
  fetchData(): Promise<void>[] {
    return this.cityService
      .getAllCities()
      .map(this.fetchWeatherForCity.bind(this));
  }

  async fetchWeatherForCity({ name, id }: City) {
    try {
      const cityWeather: CityWeather = await this.weatherDataService.getForecastWeatherByCityId(
        id,
      );

      const existedItem = await this.cityWeatherService.getById(id);
      if (existedItem) {
        await this.cityWeatherService.update(cityWeather);
        this.logger.log(`Updated weather data for city ${name} successfully`);
      } else {
        await this.cityWeatherService.create(cityWeather);
        this.logger.log(`Added weather data for city ${name} successfully`);
      }
    } catch (e) {
      this.logger.error(`Can not fetch weather data for city ${name}`, e);
    }
  }
}
