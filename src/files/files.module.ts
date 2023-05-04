import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
// s3 bucket
import { S3Client } from '@aws-sdk/client-s3';
import * as multerS3 from 'multer-s3';
// cloud storage

import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { AllConfigType } from 'src/config/config.type';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const storages = {
          local: () =>
            diskStorage({
              destination: configService.get('file.folder', {
                infer: true,
              }),
              filename: (request, file, callback) => {
                callback(
                  null,
                  `${randomStringGenerator()}.${file.originalname
                    .split('.')
                    .pop()
                    ?.toLowerCase()}`,
                );
              },
            }),
          s3: () => {
            const s3 = new S3Client({
              region: configService.get('s3.awsS3Region', { infer: true }),
              credentials: {
                accessKeyId: configService.getOrThrow('s3.accessKeyId', {
                  infer: true,
                }),
                secretAccessKey: configService.getOrThrow(
                  's3.secretAccessKey',
                  { infer: true },
                ),
              },
            });

            return multerS3({
              s3: s3,
              bucket: configService.getOrThrow('s3.awsDefaultS3Bucket', {
                infer: true,
              }),
              acl: 'public-read',
              contentType: multerS3.AUTO_CONTENT_TYPE,
              key: (request, file, callback) => {
                callback(
                  null,
                  `${randomStringGenerator()}.${file.originalname
                    .split('.')
                    .pop()
                    ?.toLowerCase()}`,
                );
              },
            });
          },
          cs: () => {
            // const cs
            return null;
          },
        };

        return {
          fileFilter: (request, file, callback) => {
            const allowedFileTypes: string = configService
              .getOrThrow('file.allowedFileTypes', { infer: true })
              .split(',')
              .join('|');
            const re = new RegExp(`.(${allowedFileTypes})`, 'i');
            if (!file.originalname.match(re)) {
              return callback(
                new HttpException(
                  {
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                      file: `cantUploadFileType`,
                    },
                  },
                  HttpStatus.UNPROCESSABLE_ENTITY,
                ),
                false,
              );
            }

            callback(null, true);
          },
          storage:
            storages[
              configService.getOrThrow('file.provider', { infer: true })
            ](),
          limits: {
            fileSize: configService.get('file.maxFileSize', { infer: true }),
          },
        };
      },
    }),
  ],
  controllers: [FilesController],
  providers: [ConfigModule, ConfigService, FilesService],
})
export class FilesModule {}
