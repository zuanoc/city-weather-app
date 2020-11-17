import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CityWeatherDocument = CityWeather & Document;

export class CityWeatherSlice {
  @ApiProperty()
  date: Date;
  @ApiProperty()
  celciusTemperature: number;
  @ApiProperty()
  warmClothRequired: boolean;
}

@Schema()
export class CityWeather {
  @Prop({
    index: true,
  })
  @ApiProperty()
  cityId: number;

  @Prop()
  @ApiProperty()
  updatedTime: Date;

  @Prop()
  @ApiProperty()
  cityName: string;

  @Prop()
  @ApiProperty({ type: CityWeatherSlice, isArray: true })
  cityWeatherSlices: CityWeatherSlice[];
}

export const CityWeatherSchema = SchemaFactory.createForClass(CityWeather);
