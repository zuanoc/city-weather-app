import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class City {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}

export const cities: City[] = [
  {
    id: 1581130,
    name: 'Hanoi',
  },
  {
    id: 658225,
    name: 'Helsinki',
  },
];

@Injectable()
export class CityService {
  getAllCities(): City[] {
    return cities;
  }
}
