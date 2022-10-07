import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  FamiliesResponse,
  PersonInput,
  PersonUpdate,
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

  @Get('familyTree')
  async getFamilyTree(): Promise<Person> {
    return await this.service.getFamiliesTree();
  }

  @Put('person/:id')
  async editPerson(
    @Body() payload: PersonUpdate,
    @Param('id') param: string,
  ): Promise<Person> {
    return await this.service.update({ ...payload, id: param });
  }

  @Get('person/:id')
  async getPerson(@Param('id') param: string): Promise<Person> {
    return await this.service.getPerson(param);
  }

  @Get('descendants/:id')
  async getChildren(@Param('id') param: string): Promise<Person[]> {
    return await this.service.getDescendants(param);
  }
  @Get('ancestors')
  async getParents(): Promise<Person> {
    return await this.service.getAncestor();
  }
}
