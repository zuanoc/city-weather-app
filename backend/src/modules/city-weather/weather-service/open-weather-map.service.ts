import { OpenWeatherMapApi } from 'node-ts-open-weather-map';
import { APP_CONFIG } from '../../../app.config';
import { CityWeather, CityWeatherSlice } from '../city-weather.schema';

export interface WeatherDataService {
  getForecastWeatherByCityId(cityId: number): Promise<CityWeather>;
}

export class OpenWeatherMapDataService implements WeatherDataService {
  private readonly openWeatherMapApi = new OpenWeatherMapApi({
    key: APP_CONFIG.openWeatherMapServiceApiKey,
  });

  async getForecastWeatherByCityId(cityId: number): Promise<CityWeather> {
    const apiResult = await this.openWeatherMapApi.forecastByCityId(cityId);
    const cityWeatherSlices: CityWeatherSlice[] = apiResult.list.map(
      (value) => {
        return {
          date: new Date(value.dt_txt),
          celciusTemperature: value.main.temp,
          warmClothRequired: APP_CONFIG.temperatureLimit > value.main.temp,
        };
      },
    );

    return {
      cityId: apiResult.city.id,
      cityName: apiResult.city.name,
      cityWeatherSlices,
      updatedTime: new Date(),
    };
  }
}
