import { Column, Entity } from 'typeorm';

import { User } from '../../user/user.entity';

@Entity()
export class Company extends User {
  @Column({ nullable: true, unique: true })
  cnpj: string;
}
