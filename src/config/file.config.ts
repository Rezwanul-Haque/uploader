import { registerAs } from '@nestjs/config';
import { FileConfig } from './config.type';

export default registerAs<FileConfig>('file', () => ({
  provider: process.env.PROVIDER ?? 'local',
  maxFileSize: Number(process.env.MAX_FILE_SIZE),
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES,
  folder: process.env.FOLDER,
  uploadLimit: Number(process.env.UPLOAD_LIMIT),
  downloadLimit: Number(process.env.DOWNLOAD_LIMIT),
}));
