import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import { AppService } from './app.service';
import { systemConfig } from './core/system/system.config';
import { FileInterface } from './shared/interfaces/file.interface';

@Controller()
export class AppController {
  constructor(private service: AppService) {}
  @Get()
  getApp(@Res() res: any) {
    return res.sendFile('index.html', {
      root: systemConfig.FRONTEND,
    });
  }
  @Get('home')
  home(@Res() res: any) {
    return res.sendFile('index.html', {
      root: systemConfig.FRONTEND,
    });
  }
  @Get('home/:app')
  getRoute(@Res() res: any, @Param('app') app: string) {
    return res.sendFile(app === 'i' || app === 'home' ? 'index.html' : app, {
      root: systemConfig.FRONTEND,
    });
  }
  @Get('home/:app/*')
  loadApp(@Res() res: any, @Param() params: any) {
    return res.sendFile(params['0'], {
      root: systemConfig.FRONTEND,
    });
  }
  @Get('api/status')
  status() {
    return { status: '✅' };
  }

  @Post('api/apps/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: systemConfig.TMP,
        filename: (
          req: any,
          file: any,
          cb: (arg0: any, arg1: string) => void,
        ) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, randomName + '.app.zip');
        },
      }),
    }),
  )
  async create(
    @Res() res: any,
    @UploadedFile() file: FileInterface,
  ): Promise<{ status: boolean; message?: string; error?: string }> {
    try {
      const data = await this.service.create(file);
      return res
        .status(data.status ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
        .send(data);
    } catch (error) {
      unlinkSync(systemConfig.TMP + '/' + file.filename);
      res.status(HttpStatus.BAD_REQUEST).send({ error: error.message });
    }
  }
}
