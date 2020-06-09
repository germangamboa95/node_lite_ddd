import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Note } from '../../Notes/models/Note';
export interface UserInterface {
  id?: number;
  firstName: string;
  lastName: string;
  age: number;
  created_at: Date;
  updated_at: Date;
}
@Entity()
export class User implements UserInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @OneToMany(
    type => Note,
    note => note.user,
  )
  notes: Note[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  user: Note[];
}
