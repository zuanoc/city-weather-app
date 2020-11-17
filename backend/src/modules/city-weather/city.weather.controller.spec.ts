import { Test, TestingModule } from '@nestjs/testing';
import { CityWeatherController } from './city-weather.controller';
import { CityWeatherService } from './weather-service/city-weather.service';
import { CityWeather } from './city-weather.schema';

describe('CityWeatherController', () => {
  let cityWeatherController: CityWeatherController;
  let cityWeatherService: CityWeatherService;

  beforeEach(async () => {
    const mockCityWeatherService = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      findAll: () => {},
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CityWeatherController],
      providers: [
        {
          provide: CityWeatherService,
          useValue: mockCityWeatherService,
        },
      ],
    }).compile();

    cityWeatherController = app.get<CityWeatherController>(
      CityWeatherController,
    );

    cityWeatherService = app.get<CityWeatherService>(CityWeatherService);
  });

  describe('/city-weather', () => {
    it('/all should return cities', () => {
      const cityWeathers: CityWeather[] = [
        {
          cityWeatherSlices: [
            {
              date: new Date(),
              celciusTemperature: 24.16,
              warmClothRequired: false,
            },
          ],
          cityId: 1581130,
          cityName: 'Hanoi',
          updatedTime: new Date(),
        },
      ];
      const cityWeathersPromise = Promise.resolve(cityWeathers);
      jest
        .spyOn(cityWeatherService, 'findAll')
        .mockImplementation(() => cityWeathersPromise);
      expect(cityWeatherController.getAll()).toBe(cityWeathersPromise);
    });
  });
});
