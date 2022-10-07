import { Controller, Get, Param, Post, Res } from '@nestjs/common';
import { FRONTEND } from './core/system/system.config';

@Controller()
export class AppController {
  @Get()
  getApp(@Res() res: any) {
    return res.sendFile('index.html', {
      root: FRONTEND,
    });
  }
  @Get('home')
  home(@Res() res: any) {
    return res.sendFile('index.html', {
      root: FRONTEND,
    });
  }
  @Get('home/:app')
  getRoute(@Res() res: any, @Param('app') app: string) {
    return res.sendFile(app === 'i' || app === 'home' ? 'index.html' : app, {
      root: FRONTEND,
    });
  }
  @Get('home/:app/*')
  loadApp(@Res() res: any, @Param() params: any) {
    return res.sendFile(params['0'], {
      root: FRONTEND,
    });
  }
  @Get('api/status')
  status() {
    return { status: '✅' };
  }

  @Post('api/apps')
  upload() {
    return { status: '✅' };
  }
}
