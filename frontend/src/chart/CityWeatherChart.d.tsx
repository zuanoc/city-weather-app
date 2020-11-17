export type CityWeatherSlice = {
    date: Date;
    celciusTemperature: number;
    warmClothRequired: boolean;
}

export type CityWeather = {
    cityId: number;
    updatedTime: string;
    cityName: string;
    cityWeatherSlices: CityWeatherSlice[];
}

export type CityTemperatures = Record<string, number>
export type ChartDataPoint = CityTemperatures & {
    data: Record<string, CityWeatherSlice>
    name: string
}

export type CityWeatherChartData = {
    chartDataPoints: ChartDataPoint[],
    cityNames: string[],
    lastUpdatedTime: string | null,
}

export type CityWeatherSliceMap = Record<string, Record<string, CityWeatherSlice>>
