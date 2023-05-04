export type AppConfig = {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  frontendDomain?: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
};

export type FileConfig = {
  provider: string;
  maxFileSize: number;
  allowedFileTypes: string;
  folder: string;
  uploadLimit: number;
  downloadLimit: number;
};

export type S3Config = {
  accessKeyId: string;
  secretAccessKey: string;
  awsDefaultS3Bucket: string;
  awsDefaultS3Url: string;
  awsS3Region: string;
};

export type CloudStorageConfig = {
  PROJECT_ID: string;
  PRIVATE_KEY?: string;
  CLIENT_EMAIL?: string;
  STORAGE_MEDIA_BUCKET?: string;
};

export type CacheConfig = {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  valueExpiresIn: number;
  database: number;
};

export type AllConfigType = {
  app: AppConfig;
  file: FileConfig;
  s3: S3Config;
  cs: CloudStorageConfig;
  cache: CacheConfig;
};
