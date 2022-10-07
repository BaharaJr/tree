import { IsIn, IsNotEmpty } from 'class-validator';

export class Parent {
  @IsNotEmpty({ message: 'Missing parent unique identifier' })
  id: string;

  firstName: string;

  middleName: string;

  gender: 'Male' | 'Female';
}

export class PersonInput {
  @IsNotEmpty({ message: 'First name cannot be empty' })
  firstName: string;

  middleName: string;

  @IsNotEmpty({ message: 'Last name cannot be empty' })
  lastName: string;

  @IsNotEmpty({ message: 'First name cannot be empty' })
  @IsIn(['Male', 'Female'])
  gender: 'Male' | 'Female';

  children: Parent[];

  @IsNotEmpty({ message: 'Parent can not be empty' })
  parent: Parent;
}

export interface FamiliesResponse {
  families: PersonInput[];
  total: number;
  hasNextPage: boolean;
}
