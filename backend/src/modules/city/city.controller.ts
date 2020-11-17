import { Controller, Get, Logger } from '@nestjs/common';
import { City, CityService } from './city.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('city')
export class CityController {
  private readonly logger = new Logger(CityController.name);

  constructor(private readonly cityService: CityService) {}

  @Get('/all')
  @ApiOperation({
    summary: 'Get all supported cities',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: City,
    isArray: true,
  })
  getAll(): City[] {
    this.logger.log('get all cities');
    return this.cityService.getAllCities();
  }
}
