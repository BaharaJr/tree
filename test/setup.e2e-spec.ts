import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

export let server: INestApplication;
export const setUpServer = async () => {
  if (!server) {
    const imports: any[] = [AppModule];
    const app: INestApplication = (
      await Test.createTestingModule({
        imports,
      }).compile()
    ).createNestApplication();
    await app.init();
    global['app'] = app;
    server = app;
    return app;
  } else {
    server.close();
  }
};

export const tearDownServer = async () => {
  if (server) {
    await server.close();
  }
};
