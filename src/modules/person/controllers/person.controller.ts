import { Body, Controller, Post } from '@nestjs/common';
import { PersonInput } from '../../../shared/interfaces/person.interface';
import { Person } from '../entities/person.entity';
import { PersonService } from '../services/person.service';

@Controller('api')
export class PersonController {
  constructor(private readonly service: PersonService) {}

  @Post('register')
  async create(@Body() payload: PersonInput): Promise<Person> {
    return await this.service.create(payload);
  }
}
