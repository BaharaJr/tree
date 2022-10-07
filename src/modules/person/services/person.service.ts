import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageDetails } from '../../../shared/interfaces/pager.interface';
import {
  FamiliesResponse,
  PersonInput,
} from '../../../shared/interfaces/person.interface';
import { Person } from '../entities/person.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person) private repository: Repository<Person>,
  ) {}

  async create(person: PersonInput): Promise<Person> {
    const parent = await this.repository.save(person);
    if (person.children.length > 0) {
      parent.children = await this.createChildren(parent);
    }
    return parent;
  }

  getFamilies = async (pager: PageDetails): Promise<FamiliesResponse> => {
    const [families, total] = await this.repository.findAndCount({
      take: pager.pageSize,
      skip: pager.page * pager.pageSize,
    });
    return {
      families,
      total,
      hasNextPage: Math.ceil(total % pager.pageSize) > pager.page,
    };
  };

  private createChildren = async (parent: Person): Promise<Person[]> => {
    const data = parent.children.map((child: Person) => {
      return { ...child, parent: { id: parent.id } };
    });
    return await this.repository.save(data);
  };
}
