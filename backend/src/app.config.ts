export type AppConfig = {
  env: string;
  temperatureLimit: number,
  apiCacheTtlInSeconds: number;
  weatherFetchingInternalInSeconds: number;
  mongodbUri: string;
  openWeatherMapServiceApiKey: string;
};

export const APP_CONFIG: AppConfig = {
  env: process.env.ENV || 'dev',
  temperatureLimit: parseInt(process.env.TEMPERATURE_LIMIT || '5'),
  apiCacheTtlInSeconds: parseInt(process.env.API_CACHE_TTL_IN_SECONDS || '5'),
  weatherFetchingInternalInSeconds: parseInt(
    process.env.WEATHER_FETCHING_INTERVAL_IN_SECONDS || '5',
  ),
  mongodbUri:
    process.env.MONGO_DB_URI ||
    'mongodb+srv://admin:hello123@credinord-demo.gkexz.mongodb.net/credinord-demo?retryWrites=true&w=majority',
  openWeatherMapServiceApiKey:
    process.env.MAP_SERVICE_API_KEY || '7310dbb5d30e1c019e4f8d9e5991aca4',
};

console.log(APP_CONFIG);
