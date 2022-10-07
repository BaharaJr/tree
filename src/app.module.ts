import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
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
  providers: [],
})
export class AppModule {}
