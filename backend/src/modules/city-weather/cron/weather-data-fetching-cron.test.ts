import { Test, TestingModule } from '@nestjs/testing';
import { CityWeatherService } from '../weather-service/city-weather.service';
import { CityWeather, CityWeatherSchema } from '../city-weather.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CityService } from '../../city/city.service';
import { WeatherDataService } from '../weather-service/open-weather-map.service';
import { WeatherDataFetchingCron } from './weather-data-fetching-cron';

describe('WeatherDataFetchingCron', () => {
  let weatherDataFetchingCron: WeatherDataFetchingCron;
  let cityWeatherService: CityWeatherService;
  let app: TestingModule;
  const celciusTemperature = 24.16;
  const cityId1 = 1581130;
  const cityId2 = 658225;

  function getCityWeather(cityId: number): CityWeather {
    return {
      cityWeatherSlices: [
        {
          date: new Date(),
          celciusTemperature: celciusTemperature,
          warmClothRequired: false,
        },
      ],
      cityId: cityId,
      cityName: 'name-' + cityId,
      updatedTime: new Date(),
    };
  }

  beforeEach(async () => {
    const openWeatherMapDataService: WeatherDataService = {
      async getForecastWeatherByCityId(cityId: number): Promise<CityWeather> {
        return getCityWeather(cityId);
      },
    };
    app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGO_URL, {
          useNewUrlParser: true,
        }),
        MongooseModule.forFeature([
          { name: CityWeather.name, schema: CityWeatherSchema },
        ]),
      ],
      providers: [
        CityWeatherService,
        CityService,
        {
          provide: 'WeatherDataService',
          useValue: openWeatherMapDataService,
        },
        WeatherDataFetchingCron,
      ],
    }).compile();

    weatherDataFetchingCron = app.get<WeatherDataFetchingCron>(
      WeatherDataFetchingCron,
    );
    cityWeatherService = app.get<CityWeatherService>(CityWeatherService);
    await cityWeatherService.cityWeatherModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  it('should add weathers to db by cron', async () => {
    const promises = weatherDataFetchingCron.fetchData();
    await Promise.all(promises);

    const data = await cityWeatherService.findAll();
    expect(data.length).toBe(2);

    const cw1 = await cityWeatherService.getById(cityId1);
    expect(cw1.cityName).toBe('name-' + cityId1);

    const cw2 = await cityWeatherService.getById(cityId2);
    expect(cw2.cityName).toBe('name-' + cityId2);
  });

  it('should update weathers in db by cron', async () => {
    let promises = weatherDataFetchingCron.fetchData();
    await Promise.all(promises);

    let cw = await cityWeatherService.getById(cityId1);
    const firstUpdatedTime = cw.updatedTime;
    expect(firstUpdatedTime).toBeDefined();

    promises = weatherDataFetchingCron.fetchData();
    await Promise.all(promises);

    cw = await cityWeatherService.getById(cityId1);
    const secondUpdatedTime = cw.updatedTime;
    expect(secondUpdatedTime).toBeDefined();

    expect(secondUpdatedTime.getTime()).toBeGreaterThan(
      firstUpdatedTime.getTime(),
    );
  });
});
