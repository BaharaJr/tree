import { IsNotEmpty } from 'class-validator';

export class PageDetails {
  @IsNotEmpty({ message: 'Page cannot be empty' })
  page: number;

  @IsNotEmpty({ message: 'Page size cannot be empty' })
  pageSize: number;
}
