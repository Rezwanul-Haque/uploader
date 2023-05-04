import { registerAs } from '@nestjs/config';
import { CacheConfig } from './config.type';

export default registerAs<CacheConfig>('cache', () => ({
  type: process.env.CACHE_TYPE,
  host: process.env.CACHE_HOST,
  port: Number(process.env.CACHE_PORT),
  username: process.env.CACHE_USERNAME ?? '',
  password: process.env.CACHE_PASSWORD ?? '',
  valueExpiresIn: Number(process.env.CACHE_VALUE_EXPIRES_IN),
  database: Number(process.env.CACHE_DATABASE),
}));
