import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, TreeRepository } from 'typeorm';
import { PageDetails } from '../../../shared/interfaces/pager.interface';
import {
  FamiliesResponse,
  PersonInput,
  PersonUpdate,
} from '../../../shared/interfaces/person.interface';
import { Person } from '../entities/person.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person) private repository: TreeRepository<Person>,
  ) {}

  create = async (person: PersonInput): Promise<Person> => {
    const parent = await this.repository.findOne({
      where: { id: person.parent.id },
    });
    if (parent.gender === 'Female') {
      throw new Error('A female parent can not have descendants');
    }
    return await this.createPerson(person);
  };

  createPerson = async (person: PersonInput): Promise<Person> => {
    const createdPerson = await this.repository.save(person);
    if (person.children.length > 0 && createdPerson.gender === 'Male') {
      createdPerson.children = await this.createChildren(createdPerson);
    }
    return createdPerson;
  };

  update = async (person: PersonUpdate): Promise<Person> => {
    await this.repository.findOneOrFail({ where: { id: person.id } });
    return await this.create(person as PersonInput);
  };

  getPerson = async (id: string): Promise<Person> => {
    return await this.repository.findOneOrFail({ where: { id } });
  };
  getDescendants = async (id: string): Promise<Person[]> => {
    const parent = await this.repository.findOneOrFail({ where: { id } });
    return await this.repository.findDescendants(parent);
  };

  getFamilies = async (pager: PageDetails): Promise<FamiliesResponse> => {
    const [families, total] = await this.repository.findAndCount({
      take: pager.pageSize,
      skip: pager.page * pager.pageSize,
    });
    return {
      families,
      total,
      hasNextPage: Math.ceil(Number(total) / pager.pageSize) > pager.page,
    };
  };

  getFamiliesTree = async (): Promise<Person> => {
    const ancestor = await this.repository.findTrees();
    return await this.repository.findDescendantsTree(ancestor[0]);
  };

  getAncestor = async (): Promise<Person> => {
    return await this.repository.findOne({
      where: { parent: IsNull() },
      relations: ['children'],
    });
  };
  private createChildren = async (parent: Person): Promise<Person[]> => {
    const data = parent.children.map((child: Person) => {
      return { ...child, parent: { id: parent.id } };
    });
    return await this.repository.save(data);
  };
}
