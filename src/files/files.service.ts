import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}
  get(publicKey: string, res: any) {
    return res.sendFile(publicKey, {
      root: this.configService.get('file.folder', { infer: true }),
    });
  }
  async uploadFile(file: Express.Multer.File | Express.MulterS3.File) {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const path = {
      local: `/${this.configService.get('file.folder', { infer: true })}/${
        file.path
      }`,
    };

    return {
      publicKey: file.filename.split('.')[0],
      path: path.local,
      privateKey: randomStringGenerator(),
    };
  }
}
