import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import React, {FunctionComponent, useEffect, useState} from "react";
import useFetch, {CachePolicies} from 'use-http'
import {format} from 'date-fns';
import {WinterCoatChartDot} from "./WinterCoatChartDot";
import {
  ChartDataPoint, CityTemperatures,
  CityWeather,
  CityWeatherChartData,
  CityWeatherSlice,
  CityWeatherSliceMap
} from "./CityWeatherChart.d";
import {AppConfig} from "../AppConfig";

const randomColor = require('randomcolor');

export const CityWeatherChart: FunctionComponent = () => {
  const {get, response} = useFetch(`${AppConfig.apiEndpointBaseUrl}/city-weather/all`, {cachePolicy: CachePolicies.NO_CACHE})
  const [cityWeatherChartData, setCityWeatherChartData] = useState<CityWeatherChartData>({
    chartDataPoints: [],
    cityNames: [],
    lastUpdatedTime: '',
  });


  useEffect(() => {
    fetchCityWeatherData();
  }, [])

  async function fetchCityWeatherData() {
    const cityWeathers: CityWeather[] = await get();
    if (!response.ok || cityWeathers.length === 0) {
      return;
    }

    const cityNames = cityWeathers.map(cw => cw.cityName);

    // build and set cityWeatherChartData
    const cityWeatherSliceMap: CityWeatherSliceMap = cityWeathers.reduce((accumulator: CityWeatherSliceMap, cityWeather) => {
      cityWeather.cityWeatherSlices.forEach(slice => {
        let timeString = format(new Date(slice.date), 'dd/MM kk:mm');
        accumulator[timeString] = {
          [cityWeather.cityName]: slice,
          ...accumulator[timeString]
        }
      })
      return accumulator;
    }, {})

    const chartDataPoints = Object.keys(cityWeatherSliceMap).map((timeString: string) => {
      const data: Record<string, CityWeatherSlice> = {}
      const cityTemperatures: CityTemperatures = {}
      cityNames.forEach(name => {
        cityTemperatures[name] = cityWeatherSliceMap[timeString][name].celciusTemperature
        data[name] = cityWeatherSliceMap[timeString][name]
      })
      return {
        name: timeString,
        data,
        ...cityTemperatures,
      } as ChartDataPoint;
    })

    setCityWeatherChartData({
      chartDataPoints,
      cityNames,
      lastUpdatedTime: cityWeathers[0].updatedTime
    })
  }

  return (
    <div className="text-center">
      <div className="d-flex flex-column">
        <h1 className="m-5">
          Temperature of cities in next 5 days
        </h1>
        <div className="m-3 align-self-center">
          <LineChart width={900} height={600} data={cityWeatherChartData.chartDataPoints}
                     margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name"/>
            <YAxis label={{ value: 'Temperature in °C', angle: -90, position: 'end' }} />
            <Tooltip/>
            <Legend/>
            {
              cityWeatherChartData.cityNames.map(name => {
                return <Line key={name} type="monotone" dataKey={name} stroke={randomColor()}
                             dot={<WinterCoatChartDot/>}/>
              })
            }
          </LineChart>
        </div>
        {
          cityWeatherChartData.cityNames.length > 0 &&
          <div>
            <button className="btn btn-success btn-sm mr-2"
                    title="Click to refresh data"
                    onClick={() => fetchCityWeatherData()}>
              <i className="fas fa-sync-alt"/>
            </button>
            <span className="font-weight-lighter font-italic">Updated at: {cityWeatherChartData.lastUpdatedTime}</span>
          </div>
        }
      </div>
    </div>
  );
}
