import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('closure-table')
@Index('unique_child', ['firstName', 'parent'], { unique: true })
@Index('unique_child_names', ['firstName', 'lastName', 'parent'], {
  unique: true,
})
@Index(
  'unique_child_names_parent',
  ['firstName', 'middleName', 'lastName', 'parent'],
  { unique: true },
)
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'firstname', nullable: false })
  firstName: string;

  @Column({ name: 'middlename', nullable: true })
  middleName: string;

  @Column({ name: 'lastname', nullable: false })
  lastName: string;

  @Column({ name: 'gender', nullable: false })
  gender: 'Male' | 'Female';

  @TreeChildren()
  children: Person[];

  @TreeParent()
  parent: Person;
}
