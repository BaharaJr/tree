import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpErrorFilter } from './core/interceptors/errors.interceptor';
import { dbConfig } from './core/system/system.config';
import { modules } from './modules/modules';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'postgres',
      ...dbConfig,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    ...modules,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_FILTER, useClass: HttpErrorFilter }, AppService],
})
export class AppModule {}
