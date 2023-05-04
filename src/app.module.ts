import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { HomeModule } from './home/home.module';
import { FilesModule } from './files/files.module';

import appConfig from './config/app.config';
import fileConfig from './config/file.config';
import csConfig from './config/cs.config';
import s3Config from './config/s3.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, fileConfig, csConfig, s3Config],
      envFilePath: ['.env'],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
    }),
    HomeModule,
    FilesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
