import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Company extends User {}
