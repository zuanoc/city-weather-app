import { Test, TestingModule } from '@nestjs/testing';
import { CityController } from './city.controller';
import { cities, CityService } from './city.service';

describe('CityController', () => {
  let cityController: CityController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [CityService],
    }).compile();

    cityController = app.get<CityController>(CityController);
  });

  describe('/city', () => {
    it('/all should return cities', () => {
      expect(cityController.getAll()).toBe(cities);
    });
  });
});
