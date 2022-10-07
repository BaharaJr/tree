import {
  BaseEntity,
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
export class Person extends BaseEntity {
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

  @Column({ default: () => 'LOCALTIMESTAMP' })
  created: Date;

  @Column()
  dob: Date;

  @Column({ default: () => 'LOCALTIMESTAMP', name: 'lastupdated' })
  lastUpdated: Date;

  static createTree = async () => {
    try {
      const ancestor = await Person.findOne({
        where: { id: '9b2133c8-1f61-4ab3-b17a-48d7656d6c15' },
      });
      if (!ancestor) {
        await Person.save({
          firstName: 'Mangi',
          lastName: 'Rindi',
          gender: 'Male',
          dob: '1800-07-01',
          id: '9b2133c8-1f61-4ab3-b17a-48d7656d6c15',
        });
      }
    } catch (e) {}
  };
}
