import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../Users/models/User';
import { Reminder } from './Reminder';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @ManyToOne(
    type => User,
    user => user.notes,
  )
  user: User;

  @ManyToOne(
    type => Reminder,
    reminder => reminder.note,
  )
  reminders: Reminder;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
