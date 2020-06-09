import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { Note } from './Note';

export enum ReminderStatus {
  WAITNG = 'WAITING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

@Entity()
export class Reminder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  remind_at: Date;

  @Column()
  status: ReminderStatus = ReminderStatus.WAITNG;

  @ManyToOne(
    type => Note,
    note => note.reminders,
  )
  note: Note;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
