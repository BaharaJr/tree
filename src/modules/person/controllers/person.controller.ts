import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  FamiliesResponse,
  PersonInput,
} from '../../../shared/interfaces/person.interface';
import { getPager } from '../../../shared/helpers/pager.details';
import { Person } from '../entities/person.entity';
import { PersonService } from '../services/person.service';

@Controller('api')
export class PersonController {
  constructor(private readonly service: PersonService) {}

  @Post('register')
  async create(@Body() payload: PersonInput): Promise<Person> {
    return await this.service.create(payload);
  }

  @Get('families')
  async getFamilies(@Query() query: any): Promise<FamiliesResponse> {
    return await this.service.getFamilies(getPager(query));
  }
}
