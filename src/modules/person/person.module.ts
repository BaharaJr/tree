import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonController } from './controllers/person.controller';
import { Person } from './entities/person.entity';
import { PersonService } from './services/person.service';

@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}
