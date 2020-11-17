import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CityWeather, CityWeatherDocument } from '../city-weather.schema';

@Injectable()
export class CityWeatherService {
  constructor(
    @InjectModel(CityWeather.name)
    public cityWeatherModel: Model<CityWeatherDocument>,
  ) {}

  async create(cityWeather: CityWeather): Promise<CityWeather> {
    const cityWeatherModel = new this.cityWeatherModel(cityWeather);
    return cityWeatherModel.save();
  }

  async update(cityWeather: CityWeather): Promise<CityWeather> {
    await this.cityWeatherModel
      .updateOne({ cityId: cityWeather.cityId }, cityWeather)
      .exec();

    return cityWeather;
  }

  async findAll(): Promise<CityWeather[]> {
    return this.cityWeatherModel.find().exec();
  }

  getById(cityId: number): Promise<CityWeather> {
    return this.cityWeatherModel.findOne({ cityId: cityId }).exec();
  }
}
