import { Test, TestingModule } from '@nestjs/testing';
import { CityWeatherService } from './city-weather.service';
import { CityWeather, CityWeatherSchema } from '../city-weather.schema';
import { MongooseModule } from '@nestjs/mongoose';

describe('CityWeatherService', () => {
  let cityWeatherService: CityWeatherService;
  let cityWeather: CityWeather;
  let app: TestingModule;
  const cityId = 1581130;
  const celciusTemperature = 24.16;
  const cityName = 'Hanoi';

  beforeEach(async () => {
    cityWeather = {
      cityWeatherSlices: [
        {
          date: new Date(),
          celciusTemperature: celciusTemperature,
          warmClothRequired: false,
        },
      ],
      cityId: cityId,
      cityName: cityName,
      updatedTime: new Date(),
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
      providers: [CityWeatherService],
    }).compile();

    cityWeatherService = app.get<CityWeatherService>(CityWeatherService);
    await cityWeatherService.cityWeatherModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  it('should find all', async () => {
    const data = await cityWeatherService.findAll();
    expect(data).toStrictEqual([]);
  });

  it('should create', async () => {
    await cityWeatherService.create(cityWeather);
    const cw = await cityWeatherService.getById(cityId);
    expect(cw.cityName).toBe(cityName);
    expect(cw.cityWeatherSlices[0].celciusTemperature).toBe(celciusTemperature);
  });

  it('should update', async () => {
    const newTemperature = 50;
    await cityWeatherService.create(cityWeather);
    const newCw = await cityWeatherService.getById(cityId);
    newCw.cityWeatherSlices[0].celciusTemperature = newTemperature;
    await cityWeatherService.update(newCw);
    const updatedCw = await cityWeatherService.getById(cityId);
    expect(updatedCw.cityWeatherSlices[0].celciusTemperature).toBe(
      newTemperature,
    );
  });
});
