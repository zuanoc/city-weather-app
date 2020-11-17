import { Controller, Get, Logger } from '@nestjs/common';
import { CityWeatherService } from './weather-service/city-weather.service';
import { CityWeather } from './city-weather.schema';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('city-weather')
export class CityWeatherController {
  private readonly logger = new Logger(CityWeatherController.name);

  constructor(private readonly cityWeatherService: CityWeatherService) {}

  @Get('/all')
  @ApiOperation({
    summary: 'Get weather data of all cities with limit warning',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: CityWeather,
    isArray: true,
  })
  getAll(): Promise<CityWeather[]> {
    this.logger.log('get weather data of all cities');
    return this.cityWeatherService.findAll();
  }
}
