import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonInput } from '../../../shared/interfaces/person.interface';
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

  private createChildren = async (parent: Person): Promise<Person[]> => {
    const data = parent.children.map((child: Person) => {
      return { ...child, parent: { id: parent.id } };
    });
    return await this.repository.save(data);
  };
}
