import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UploadedFile,
  Response,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { Throttle } from '@nestjs/throttler';
import {
  DOWNLOADLIMIT,
  RATELIMITTTL,
  UPLOADLIMIT,
} from '../config/rate.limit.config';
import * as fs from 'fs';

@ApiTags('Files')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Throttle(UPLOADLIMIT, RATELIMITTTL)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File | Express.MulterS3.File,
  ) {
    return this.filesService.uploadFile(file);
  }

  @Delete(':privateKey')
  async delete(@Param('privateKey') privateKey: string) {
    fs.unlink(
      `${this.configService.get('file.folder', {
        infer: true,
      })}/${privateKey}.jpg`,
      (err) => {
        return err;
      },
    );
    return { message: 'successfully delete the file' };
  }

  @Get(':publicKey')
  @Throttle(DOWNLOADLIMIT, RATELIMITTTL)
  async get(@Param('publicKey') publicKey: string, @Response() res) {
    return res.sendFile(`${publicKey}.jpg`, {
      root: this.configService.get('file.folder', { infer: true }),
    });
  }
}
