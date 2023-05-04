import { registerAs } from '@nestjs/config';
import { CloudStorageConfig } from './config.type';

export default registerAs<CloudStorageConfig>('cs', () => ({
  PROJECT_ID: process.env.PROJECT_ID,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  CLIENT_EMAIL: process.env.CLIENT_EMAIL,
  STORAGE_MEDIA_BUCKET: process.env.STORAGE_MEDIA_BUCKET,
}));
