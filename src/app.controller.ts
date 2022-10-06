import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  redirect(@Res() res: any): any {
    return res.redirect(process.env.FRONT_END);
  }
  @Get('api/status')
  status() {
    return { status: '✅' };
  }
}
